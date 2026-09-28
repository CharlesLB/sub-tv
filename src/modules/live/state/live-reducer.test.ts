import { describe, expect, it, vi } from 'vitest'
import { LIVE_EVENT_TYPE, MATCH_PERIOD, SIDE } from '@/modules/matches/client'
import { createInitialState } from './initial-state'
import { CARD_COLOR, LIVE_ACTION, type LiveAction } from './live-actions'
import { liveReducer } from './live-reducer'
import { type LiveState, SERVER_OPERATION, SYNC_STATE, TOAST_TONE } from './live-state'
import { makeSnapshot, PLAYER } from './live-state.fixtures'
import { derivePlayerStates, selectScore } from './selectors'
import { LIVE_MESSAGE, MAXIMUM_TOASTS } from './toasts'

vi.mock('@/modules/matches/client', async () => ({
  ...(await vi.importActual('@/modules/matches/live-match/live-match')),
  ...(await vi.importActual('@/modules/matches/live-clock/live-clock')),
  ...(await vi.importActual('@/modules/matches/pitch-layout/pitch-layout')),
}))

const NOW_MS = Date.parse('2026-09-19T13:00:00.000Z')
const MINUTE_MS = 60_000

const run = (state: LiveState, ...actions: LiveAction[]): LiveState => actions.reduce(liveReducer, state)

const goal = (playerId: string, clientId: string, nowMs = NOW_MS): LiveAction => ({ type: LIVE_ACTION.GOAL_RECORDED, playerId, clientId, nowMs })

const card = (playerId: string, color: (typeof CARD_COLOR)[keyof typeof CARD_COLOR], prefix: string): LiveAction => ({
  type: LIVE_ACTION.CARD_RECORDED,
  playerId,
  color,
  clientIds: [`${prefix}-first`, `${prefix}-second`],
  nowMs: NOW_MS,
})

const startedState = (): LiveState => run(createInitialState(makeSnapshot()), { type: LIVE_ACTION.CLOCK_ADVANCED, nowMs: NOW_MS })

const lastToast = (state: LiveState) => state.toasts.at(-1)

describe('liveReducer', () => {
  it('initial state with a home number nine on the pitch selects that player', () => {
    const state = createInitialState(makeSnapshot())

    expect(state.selectedPlayerId).toBe(PLAYER.HOME_STRIKER)
  })

  it('player selection when a substitution is pending selects the player and cancels the substitution', () => {
    const state = run(startedState(), { type: LIVE_ACTION.SUBSTITUTION_STARTED }, { type: LIVE_ACTION.PLAYER_SELECTED, playerId: PLAYER.AWAY_STRIKER })

    expect(state.selectedPlayerId).toBe(PLAYER.AWAY_STRIKER)
    expect(state.pendingSubstitution).toBe(false)
  })

  it('goal by a starter increases the score, pulses and queues the event with an undoable toast', () => {
    const state = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1', NOW_MS + 12 * MINUTE_MS))

    expect(selectScore(state.events)).toEqual({ [SIDE.HOME]: 1, [SIDE.AWAY]: 0 })
    expect(state.events[0]).toMatchObject({ key: 'goal-1', minute: 12, period: MATCH_PERIOD.FIRST_HALF, syncState: SYNC_STATE.PENDING })
    expect(state.pulseCount).toBe(1)
    expect(state.outbox.at(-1)).toMatchObject({ kind: SERVER_OPERATION.RECORD })
    expect(lastToast(state)).toMatchObject({ tone: TOAST_TONE.OK, undo: { addedEventKeys: ['goal-1'] } })
  })

  it('goal by a bench player is refused with a selection warning', () => {
    const state = run(startedState(), goal(PLAYER.HOME_RESERVE, 'goal-1'))

    expect(state.events).toHaveLength(0)
    expect(lastToast(state)).toMatchObject({ message: LIVE_MESSAGE.SELECT_PLAYER, tone: TOAST_TONE.WARN })
  })

  it('goal by an expelled player is refused', () => {
    const state = run(startedState(), card(PLAYER.HOME_STRIKER, CARD_COLOR.RED, 'red'), goal(PLAYER.HOME_STRIKER, 'goal-1'))

    expect(selectScore(state.events)[SIDE.HOME]).toBe(0)
    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.PLAYER_SENT_OFF)
  })

  it('assist without a previous goal of the same team is refused', () => {
    const state = run(startedState(), goal(PLAYER.AWAY_STRIKER, 'goal-1'), { type: LIVE_ACTION.ASSIST_RECORDED, playerId: PLAYER.HOME_MIDFIELDER })

    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.GOAL_BEFORE_ASSIST)
  })

  it('assist by the scorer of the latest goal is refused', () => {
    const state = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'), { type: LIVE_ACTION.ASSIST_RECORDED, playerId: PLAYER.HOME_STRIKER })

    expect(state.events[0]?.assistPlayerId).toBeNull()
    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.SCORER_CANNOT_ASSIST)
  })

  it('assist by a teammate attaches to the latest goal and queues the assist operation', () => {
    const state = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'), { type: LIVE_ACTION.ASSIST_RECORDED, playerId: PLAYER.HOME_MIDFIELDER })

    expect(state.events[0]?.assistPlayerId).toBe(PLAYER.HOME_MIDFIELDER)
    expect(derivePlayerStates(state.players, state.events)[PLAYER.HOME_MIDFIELDER]?.assists).toBe(1)
    expect(state.outbox.at(-1)).toEqual({ kind: SERVER_OPERATION.ASSIST, goalKey: 'goal-1', assistPlayerId: PLAYER.HOME_MIDFIELDER })
  })

  it('first yellow card records a single yellow event', () => {
    const state = run(startedState(), card(PLAYER.AWAY_STRIKER, CARD_COLOR.YELLOW, 'yellow'))

    expect(state.events.map((event) => event.type)).toEqual([LIVE_EVENT_TYPE.YELLOW_CARD])
  })

  it('second yellow card adds a red card from the second yellow and expels the player', () => {
    const state = run(startedState(), card(PLAYER.AWAY_STRIKER, CARD_COLOR.YELLOW, 'first'), card(PLAYER.AWAY_STRIKER, CARD_COLOR.YELLOW, 'second'))
    const playerState = derivePlayerStates(state.players, state.events)[PLAYER.AWAY_STRIKER]

    expect(state.events.map((event) => event.type)).toEqual([LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.RED_CARD])
    expect(state.events.at(-1)?.fromSecondYellow).toBe(true)
    expect(playerState).toMatchObject({ sentOff: true, sentOffBySecondYellow: true, yellowCards: 2 })
    expect(lastToast(state)?.tone).toBe(TOAST_TONE.WARN)
  })

  it('card for an already expelled player is refused', () => {
    const state = run(startedState(), card(PLAYER.AWAY_STRIKER, CARD_COLOR.RED, 'red'), card(PLAYER.AWAY_STRIKER, CARD_COLOR.YELLOW, 'late'))

    expect(state.events).toHaveLength(1)
    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.PLAYER_ALREADY_SENT_OFF)
  })

  it('substitution puts the reserve on the leaving player coordinates and marks both players', () => {
    const state = run(startedState(), {
      type: LIVE_ACTION.SUBSTITUTION_RECORDED,
      playerOutId: PLAYER.HOME_STRIKER,
      playerInId: PLAYER.HOME_RESERVE,
      clientId: 'sub-1',
      nowMs: NOW_MS,
    })

    const states = derivePlayerStates(state.players, state.events)

    expect(state.positions[PLAYER.HOME_RESERVE]).toEqual({ x: 44, y: 50 })
    expect(states[PLAYER.HOME_RESERVE]).toMatchObject({ onPitch: true, subbedIn: true })
    expect(states[PLAYER.HOME_STRIKER]).toMatchObject({ onPitch: false, subbedOut: true })
    expect(state.outbox.at(-1)).toMatchObject({ kind: SERVER_OPERATION.SUBSTITUTION, pitchPoint: { x: 44, y: 50 } })
  })

  it('substitution of an expelled player is refused', () => {
    const state = run(startedState(), card(PLAYER.HOME_STRIKER, CARD_COLOR.RED, 'red'), {
      type: LIVE_ACTION.SUBSTITUTION_RECORDED,
      playerOutId: PLAYER.HOME_STRIKER,
      playerInId: PLAYER.HOME_RESERVE,
      clientId: 'sub-1',
      nowMs: NOW_MS,
    })

    expect(state.events).toHaveLength(1)
    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.SENT_OFF_CANNOT_BE_SUBSTITUTED)
  })

  it('substitution with a reserve of the other team is refused', () => {
    const state = run(startedState(), {
      type: LIVE_ACTION.SUBSTITUTION_RECORDED,
      playerOutId: PLAYER.HOME_STRIKER,
      playerInId: PLAYER.AWAY_RESERVE,
      clientId: 'sub-1',
      nowMs: NOW_MS,
    })

    expect(state.events).toHaveLength(0)
    expect(lastToast(state)?.message).toBe(LIVE_MESSAGE.INVALID_SUBSTITUTION)
  })

  it('undo of a goal removes the event and queues its revert', () => {
    const scored = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'))
    const toastId = lastToast(scored)?.id ?? 0
    const state = run(scored, { type: LIVE_ACTION.UNDO_REQUESTED, toastId })

    expect(state.events).toHaveLength(0)
    expect(state.outbox.at(-1)).toEqual({ kind: SERVER_OPERATION.REVERT, eventKey: 'goal-1' })
    expect(state.toasts.some((toast) => toast.id === toastId)).toBe(false)
  })

  it('undo of an assist clears the assist from the goal and queues the restore', () => {
    const assisted = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'), { type: LIVE_ACTION.ASSIST_RECORDED, playerId: PLAYER.HOME_MIDFIELDER })
    const state = run(assisted, { type: LIVE_ACTION.UNDO_REQUESTED, toastId: lastToast(assisted)?.id ?? 0 })

    expect(state.events[0]?.assistPlayerId).toBeNull()
    expect(state.outbox.at(-1)).toEqual({ kind: SERVER_OPERATION.ASSIST, goalKey: 'goal-1', assistPlayerId: null })
  })

  it('toasts beyond the maximum keep only the newest ones', () => {
    const state = run(startedState(), goal(PLAYER.HOME_RESERVE, 'a'), goal(PLAYER.HOME_RESERVE, 'b'), goal(PLAYER.HOME_RESERVE, 'c'), goal(PLAYER.HOME_RESERVE, 'd'))

    expect(state.toasts).toHaveLength(MAXIMUM_TOASTS)
  })

  it('confirmation from the server marks the event as confirmed', () => {
    const state = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'), { type: LIVE_ACTION.SYNC_CONFIRMED, syncKey: 'goal-1' })

    expect(state.events[0]?.syncState).toBe(SYNC_STATE.CONFIRMED)
  })

  it('repeated sync failures warn only once until the queue recovers', () => {
    const failed = run(startedState(), { type: LIVE_ACTION.SYNC_FAILED }, { type: LIVE_ACTION.SYNC_FAILED })
    const recovered = run(failed, { type: LIVE_ACTION.SYNC_RECOVERED })

    expect(failed.isSyncFailing).toBe(true)
    expect(failed.toasts.filter((toast) => toast.message === LIVE_MESSAGE.SYNC_FAILED)).toHaveLength(1)
    expect(recovered.isSyncFailing).toBe(false)
  })

  it('drained outbox drops the operations already handed to the queue', () => {
    const scored = run(startedState(), goal(PLAYER.HOME_STRIKER, 'goal-1'))
    const state = run(scored, { type: LIVE_ACTION.OUTBOX_DRAINED, count: scored.outbox.length - 1 })

    expect(state.outbox).toHaveLength(1)
  })

  it('moving a player stores the point and queues a position update', () => {
    const state = run(startedState(), { type: LIVE_ACTION.PLAYER_MOVED, playerId: PLAYER.HOME_MIDFIELDER, point: { x: 40, y: 20 } })

    expect(state.positions[PLAYER.HOME_MIDFIELDER]).toEqual({ x: 40, y: 20 })
    expect(state.outbox.at(-1)).toEqual({ kind: SERVER_OPERATION.POSITION, playerId: PLAYER.HOME_MIDFIELDER, point: { x: 40, y: 20 } })
  })
})
