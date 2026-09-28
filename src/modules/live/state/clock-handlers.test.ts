import { describe, expect, it, vi } from 'vitest'
import { MATCH_PERIOD } from '@/modules/matches/client'
import { createInitialState } from './initial-state'
import { LIVE_ACTION, type LiveAction } from './live-actions'
import { liveReducer } from './live-reducer'
import { type LiveState, SERVER_OPERATION, TOAST_TONE } from './live-state'
import { makeSnapshot } from './live-state.fixtures'
import { LIVE_MESSAGE } from './toasts'

vi.mock('@/modules/matches/client', async () => ({
  ...(await vi.importActual('@/modules/matches/live-match/live-match')),
  ...(await vi.importActual('@/modules/matches/live-clock/live-clock')),
  ...(await vi.importActual('@/modules/matches/pitch-layout/pitch-layout')),
}))

const KICKOFF_MS = Date.parse('2026-09-19T13:00:00.000Z')
const MINUTE_MS = 60_000

const advance = (nowMs: number): LiveAction => ({ type: LIVE_ACTION.CLOCK_ADVANCED, nowMs })

const run = (state: LiveState, ...actions: LiveAction[]): LiveState => actions.reduce(liveReducer, state)

const initial = (): LiveState => createInitialState(makeSnapshot())

describe('clock actions', () => {
  it('start before kickoff runs the first half and queues the clock', () => {
    const state = run(initial(), advance(KICKOFF_MS))

    expect(state.clock).toMatchObject({ period: MATCH_PERIOD.FIRST_HALF, running: true, startedAt: new Date(KICKOFF_MS).toISOString() })
    expect(state.outbox.at(-1)).toMatchObject({ kind: SERVER_OPERATION.CLOCK })
    expect(state.toasts.at(-1)?.message).toBe('1º tempo iniciado · 30 Min por tempo')
  })

  it('advance while the first half runs goes to half time and keeps the half length played', () => {
    const state = run(initial(), advance(KICKOFF_MS), advance(KICKOFF_MS + 36 * MINUTE_MS))

    expect(state.clock).toMatchObject({ period: MATCH_PERIOD.HALF_TIME, running: false, firstHalfMinutes: 36, elapsedSeconds: 0 })
    expect(state.toasts.at(-1)?.message).toBe(LIVE_MESSAGE.HALF_TIME)
  })

  it('advance during half time starts the second half from zero', () => {
    const state = run(initial(), advance(KICKOFF_MS), advance(KICKOFF_MS + 35 * MINUTE_MS), advance(KICKOFF_MS + 50 * MINUTE_MS))

    expect(state.clock).toMatchObject({ period: MATCH_PERIOD.SECOND_HALF, running: true, elapsedSeconds: 0, addedMinutes: 0 })
  })

  it('advance while the second half runs ends the match and later advances are ignored', () => {
    const ended = run(initial(), advance(KICKOFF_MS), advance(KICKOFF_MS + MINUTE_MS), advance(KICKOFF_MS + 2 * MINUTE_MS), advance(KICKOFF_MS + 40 * MINUTE_MS))
    const afterEnd = run(ended, advance(KICKOFF_MS + 60 * MINUTE_MS))

    expect(ended.clock).toMatchObject({ period: MATCH_PERIOD.FULL_TIME, running: false, secondHalfMinutes: 38 })
    expect(afterEnd).toBe(ended)
  })

  it('added minute before kickoff is refused with a warning', () => {
    const state = run(initial(), { type: LIVE_ACTION.CLOCK_MINUTE_ADDED })

    expect(state.clock.addedMinutes).toBe(0)
    expect(state.toasts.at(-1)).toMatchObject({ message: LIVE_MESSAGE.START_BEFORE_ADDED_TIME, tone: TOAST_TONE.WARN })
  })

  it('added minute while running increments the added time of the half', () => {
    const state = run(initial(), advance(KICKOFF_MS), { type: LIVE_ACTION.CLOCK_MINUTE_ADDED }, { type: LIVE_ACTION.CLOCK_MINUTE_ADDED })

    expect(state.clock.addedMinutes).toBe(2)
    expect(state.toasts.at(-1)?.message).toBe('Acréscimo — +2 Min no 1º tempo')
  })
})
