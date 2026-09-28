import { elapsedSecondsAt, type LiveClock, MATCH_PERIOD, minuteAt } from '@/modules/matches/client'
import { type LiveState, SERVER_OPERATION } from './live-state'
import { enqueue, inform, LIVE_MESSAGE, warn } from './toasts'

const FRESH_HALF = { elapsedSeconds: 0, addedMinutes: 0 } as const

type ClockTransition = { clock: LiveClock; message: string }

const transitionOf = (state: LiveState, nowMs: number): ClockTransition | null => {
  const { clock } = state
  const nowIso = new Date(nowMs).toISOString()

  if (clock.period === MATCH_PERIOD.FULL_TIME) return null

  if (clock.period === MATCH_PERIOD.BEFORE_START) {
    return {
      clock: { ...clock, ...FRESH_HALF, period: MATCH_PERIOD.FIRST_HALF, running: true, startedAt: nowIso },
      message: `1º tempo iniciado · ${state.halfLengthMinutes} Min por tempo`,
    }
  }

  if (clock.period === MATCH_PERIOD.HALF_TIME) {
    return { clock: { ...clock, ...FRESH_HALF, period: MATCH_PERIOD.SECOND_HALF, running: true, startedAt: nowIso }, message: LIVE_MESSAGE.SECOND_HALF_STARTED }
  }

  if (!clock.running) {
    const message = clock.period === MATCH_PERIOD.FIRST_HALF ? LIVE_MESSAGE.FIRST_HALF_RESUMED : LIVE_MESSAGE.SECOND_HALF_STARTED

    return { clock: { ...clock, running: true, startedAt: nowIso }, message }
  }

  if (clock.period === MATCH_PERIOD.FIRST_HALF) {
    return {
      clock: { ...clock, ...FRESH_HALF, period: MATCH_PERIOD.HALF_TIME, running: false, startedAt: null, firstHalfMinutes: minuteAt(clock, nowMs) },
      message: LIVE_MESSAGE.HALF_TIME,
    }
  }

  return {
    clock: {
      ...clock,
      period: MATCH_PERIOD.FULL_TIME,
      running: false,
      startedAt: null,
      elapsedSeconds: elapsedSecondsAt(clock, nowMs),
      secondHalfMinutes: minuteAt(clock, nowMs),
    },
    message: LIVE_MESSAGE.FULL_TIME,
  }
}

export const advanceClock = (state: LiveState, nowMs: number): LiveState => {
  const transition = transitionOf(state, nowMs)
  if (!transition) return state

  return inform(enqueue({ ...state, clock: transition.clock }, { kind: SERVER_OPERATION.CLOCK, clock: transition.clock }), transition.message)
}

export const addMinute = (state: LiveState): LiveState => {
  const { clock } = state
  if (!clock.running) return warn(state, LIVE_MESSAGE.START_BEFORE_ADDED_TIME)

  const addedMinutes = clock.addedMinutes + 1
  const half = clock.period === MATCH_PERIOD.SECOND_HALF ? 2 : 1
  const nextClock = { ...clock, addedMinutes }

  return inform(enqueue({ ...state, clock: nextClock }, { kind: SERVER_OPERATION.CLOCK, clock: nextClock }), `Acréscimo — +${addedMinutes} Min no ${half}º tempo`)
}
