import { describe, expect, it, vi } from 'vitest'
import { DATA_SOURCE, GOAL_TYPE, INITIAL_LIVE_CLOCK, LIVE_EVENT_TYPE, MATCH_PERIOD, type RemoteEvent, SIDE } from '@/modules/matches/client'
import { createInitialState, kickoffLineupOf } from './initial-state'
import { LIVE_ACTION, type LiveAction } from './live-actions'
import { liveReducer } from './live-reducer'
import { CLOCK_SYNC_KEY, type LiveState } from './live-state'
import { makeEvent, makeSnapshot, PLAYER } from './live-state.fixtures'
import { derivePlayerStates, selectScore } from './selectors'

vi.mock('@/modules/matches/client', async () => ({
  ...(await vi.importActual('@/modules/matches/live-match/live-match')),
  ...(await vi.importActual('@/modules/matches/live-clock/live-clock')),
  ...(await vi.importActual('@/modules/matches/pitch-layout/pitch-layout')),
}))

const NOW_MS = Date.parse('2026-09-19T13:00:00.000Z')

const run = (state: LiveState, ...actions: LiveAction[]): LiveState => actions.reduce(liveReducer, state)

const remoteGoal = (overrides: Partial<RemoteEvent> = {}): RemoteEvent => ({
  seq: 1,
  key: 'remote-goal',
  isActive: true,
  side: SIDE.AWAY,
  type: LIVE_EVENT_TYPE.GOAL,
  period: MATCH_PERIOD.FIRST_HALF,
  minute: 12,
  playerId: PLAYER.AWAY_STRIKER,
  playerOutId: null,
  assistPlayerId: null,
  goalType: GOAL_TYPE.NORMAL,
  fromSecondYellow: false,
  source: DATA_SOURCE.LIVE,
  ...overrides,
})

const received = (event: RemoteEvent): LiveAction => ({ type: LIVE_ACTION.REMOTE_EVENT_RECEIVED, event })

describe('remote merge', () => {
  it('goal recorded on another machine enters the timeline and the score', () => {
    const state = run(createInitialState(makeSnapshot()), received(remoteGoal()))

    expect(selectScore(state.events)).toEqual({ [SIDE.HOME]: 0, [SIDE.AWAY]: 1 })
  })

  it('own optimistic goal still being sent is not duplicated by the stream', () => {
    const local = run(createInitialState(makeSnapshot()), { type: LIVE_ACTION.GOAL_RECORDED, playerId: PLAYER.HOME_STRIKER, clientId: 'mine', nowMs: NOW_MS })
    const state = run(local, received(remoteGoal({ key: 'mine', side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER })))

    expect(state.events).toHaveLength(1)
    expect(state.events[0]?.side).toBe(SIDE.HOME)
  })

  it('event undone locally is not brought back by a stale stream message', () => {
    const scored = run(createInitialState(makeSnapshot()), { type: LIVE_ACTION.GOAL_RECORDED, playerId: PLAYER.HOME_STRIKER, clientId: 'mine', nowMs: NOW_MS })
    const undone = run(scored, { type: LIVE_ACTION.UNDO_REQUESTED, toastId: scored.toasts.at(-1)?.id ?? 0 }, { type: LIVE_ACTION.SYNC_CONFIRMED, syncKey: 'mine' })
    const state = run(undone, received(remoteGoal({ key: 'mine', side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER })))

    expect(state.events).toHaveLength(0)
  })

  it('event deleted on another machine disappears locally', () => {
    const withGoal = run(createInitialState(makeSnapshot()), received(remoteGoal()))
    const state = run(withGoal, received(remoteGoal({ isActive: false })))

    expect(state.events).toHaveLength(0)
  })

  it('assist attached on another machine updates the known goal', () => {
    const withGoal = run(createInitialState(makeSnapshot()), received(remoteGoal({ side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER })))
    const state = run(withGoal, received(remoteGoal({ side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER, assistPlayerId: PLAYER.HOME_MIDFIELDER })))

    expect(state.events[0]?.assistPlayerId).toBe(PLAYER.HOME_MIDFIELDER)
  })

  it('remote event naming a player outside the lineup is ignored', () => {
    const state = run(createInitialState(makeSnapshot()), received(remoteGoal({ playerId: 'stranger' })))

    expect(state.events).toHaveLength(0)
  })

  it('remote substitution moves the reserve onto the pitch', () => {
    const state = run(
      createInitialState(makeSnapshot()),
      received(remoteGoal({ key: 'sub', type: LIVE_EVENT_TYPE.SUBSTITUTION, side: SIDE.HOME, playerId: PLAYER.HOME_RESERVE, playerOutId: PLAYER.HOME_STRIKER, goalType: null })),
    )

    const states = derivePlayerStates(state.players, state.events)

    expect(states[PLAYER.HOME_RESERVE]?.onPitch).toBe(true)
    expect(states[PLAYER.HOME_STRIKER]?.onPitch).toBe(false)
  })

  it('remote clock replaces the local one unless a local clock change is still being sent', () => {
    const remoteClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FIRST_HALF, running: true, startedAt: '2026-09-19T13:00:00.000Z' }
    const synced = run(createInitialState(makeSnapshot()), { type: LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED, snapshot: { seq: 1, clock: remoteClock, positions: [] } })
    const locallyAdvanced = run(createInitialState(makeSnapshot()), { type: LIVE_ACTION.CLOCK_ADVANCED, nowMs: NOW_MS })
    const stale = run(locallyAdvanced, { type: LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED, snapshot: { seq: 1, clock: INITIAL_LIVE_CLOCK, positions: [] } })

    expect(synced.clock).toEqual(remoteClock)
    expect(locallyAdvanced.pendingSyncCounts[CLOCK_SYNC_KEY]).toBe(1)
    expect(stale.clock.period).toBe(MATCH_PERIOD.FIRST_HALF)
  })

  it('remote position moves the dot of a known player', () => {
    const state = run(createInitialState(makeSnapshot()), {
      type: LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED,
      snapshot: { seq: 1, clock: null, positions: [{ playerId: PLAYER.HOME_MIDFIELDER, x: 20, y: 70 }] },
    })

    expect(state.positions[PLAYER.HOME_MIDFIELDER]).toEqual({ x: 20, y: 70 })
  })

  it('substitution already applied to the stored lineup is unwound to the kickoff eleven', () => {
    const snapshot = makeSnapshot()

    const swappedPlayers = snapshot.players.map((player) =>
      player.playerId === PLAYER.HOME_STRIKER
        ? { ...player, isStarter: false, pitchPoint: null }
        : player.playerId === PLAYER.HOME_RESERVE
          ? { ...player, isStarter: true, pitchPoint: { x: 44, y: 50 } }
          : player,
    )

    const substitution = makeEvent({ key: 'sub', type: LIVE_EVENT_TYPE.SUBSTITUTION, side: SIDE.HOME, playerId: PLAYER.HOME_RESERVE, playerOutId: PLAYER.HOME_STRIKER, appliedToLineup: true })
    const kickoff = kickoffLineupOf(swappedPlayers, [substitution])

    expect(kickoff.find((player) => player.playerId === PLAYER.HOME_STRIKER)).toMatchObject({ isStarter: true, pitchPoint: { x: 44, y: 50 } })
    expect(kickoff.find((player) => player.playerId === PLAYER.HOME_RESERVE)?.isStarter).toBe(false)
  })
})
