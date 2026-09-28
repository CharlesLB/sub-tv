import { z } from 'zod'
import { MATCH_PERIOD, MAXIMUM_EVENT_MINUTE, type LiveClock } from '../live-match/live-match'

const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const MAXIMUM_ADDED_MINUTES = 30
const MAXIMUM_ELAPSED_SECONDS = MAXIMUM_EVENT_MINUTE * SECONDS_PER_MINUTE

export const ClockPeriodSchema = z.enum([
  MATCH_PERIOD.BEFORE_START,
  MATCH_PERIOD.FIRST_HALF,
  MATCH_PERIOD.HALF_TIME,
  MATCH_PERIOD.SECOND_HALF,
  MATCH_PERIOD.FULL_TIME,
])

const HalfMinutes = z.number().int().min(0).max(MAXIMUM_EVENT_MINUTE).nullable()

export const LiveClockSchema = z.object({
  period: ClockPeriodSchema,
  running: z.boolean(),
  startedAt: z.iso.datetime().nullable(),
  elapsedSeconds: z.number().int().min(0).max(MAXIMUM_ELAPSED_SECONDS),
  addedMinutes: z.number().int().min(0).max(MAXIMUM_ADDED_MINUTES),
  firstHalfMinutes: HalfMinutes,
  secondHalfMinutes: HalfMinutes,
})

const PersistedLiveClockSchema = z.object({
  period: ClockPeriodSchema.catch(MATCH_PERIOD.BEFORE_START),
  minute: z.number().catch(0),
  running: z.boolean().catch(false),
  startedAt: z.string().nullish().catch(null),
  elapsedSeconds: z.number().int().min(0).nullish().catch(null),
  addedMinutes: z.number().int().min(0).catch(0),
  firstHalfMinutes: z.number().int().nullish().catch(null),
  secondHalfMinutes: z.number().int().nullish().catch(null),
})

export type PersistedLiveClock = {
  period: string
  minute: number
  startedAt?: string
  running: boolean
  addedMinutes: number
  elapsedSeconds: number
  firstHalfMinutes?: number
  secondHalfMinutes?: number
}

export const INITIAL_LIVE_CLOCK: LiveClock = {
  period: MATCH_PERIOD.BEFORE_START,
  running: false,
  startedAt: null,
  elapsedSeconds: 0,
  addedMinutes: 0,
  firstHalfMinutes: null,
  secondHalfMinutes: null,
}

export const parsePersistedClock = (value: unknown): LiveClock => {
  const parsed = PersistedLiveClockSchema.safeParse(value)
  if (!parsed.success) return INITIAL_LIVE_CLOCK
  const persisted = parsed.data

  return {
    period: persisted.period,
    running: persisted.running && Boolean(persisted.startedAt),
    startedAt: persisted.startedAt ?? null,
    elapsedSeconds: persisted.elapsedSeconds ?? Math.max(0, persisted.minute) * SECONDS_PER_MINUTE,
    addedMinutes: persisted.addedMinutes,
    firstHalfMinutes: persisted.firstHalfMinutes ?? null,
    secondHalfMinutes: persisted.secondHalfMinutes ?? null,
  }
}

export const elapsedSecondsAt = (clock: LiveClock, nowMs: number): number => {
  const runningSeconds = clock.running && clock.startedAt ? Math.max(0, Math.floor((nowMs - Date.parse(clock.startedAt)) / MILLISECONDS_PER_SECOND)) : 0

  return Math.min(MAXIMUM_ELAPSED_SECONDS, clock.elapsedSeconds + runningSeconds)
}

export const minuteAt = (clock: LiveClock, nowMs: number): number => Math.floor(elapsedSecondsAt(clock, nowMs) / SECONDS_PER_MINUTE)

export const toPersistedClock = (clock: LiveClock): PersistedLiveClock => ({
  period: clock.period,
  minute: Math.floor(clock.elapsedSeconds / SECONDS_PER_MINUTE),
  running: clock.running,
  addedMinutes: clock.addedMinutes,
  elapsedSeconds: clock.elapsedSeconds,
  ...(clock.startedAt ? { startedAt: clock.startedAt } : {}),
  ...(clock.firstHalfMinutes === null ? {} : { firstHalfMinutes: clock.firstHalfMinutes }),
  ...(clock.secondHalfMinutes === null ? {} : { secondHalfMinutes: clock.secondHalfMinutes }),
})
