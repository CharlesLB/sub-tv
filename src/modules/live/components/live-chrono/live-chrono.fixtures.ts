import { INITIAL_LIVE_CLOCK, type LiveClock, MATCH_PERIOD } from '@/modules/matches/client'
import { KICKOFF_AT, runningFirstHalfClockFixture } from '../live-board/live-board.fixtures'

export const TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS = 754_000

export const nowAfterKickoffMs = Date.parse(KICKOFF_AT) + TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS

export const beforeKickoffClockFixture: LiveClock = INITIAL_LIVE_CLOCK

export const runningWithAddedTimeClockFixture: LiveClock = { ...runningFirstHalfClockFixture, addedMinutes: 2 }

export const pausedFirstHalfClockFixture: LiveClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FIRST_HALF, elapsedSeconds: 754 }

export const halfTimeClockFixture: LiveClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.HALF_TIME, firstHalfMinutes: 25 }

export const pausedSecondHalfClockFixture: LiveClock = { ...halfTimeClockFixture, period: MATCH_PERIOD.SECOND_HALF, elapsedSeconds: 300 }

export const runningSecondHalfClockFixture: LiveClock = { ...pausedSecondHalfClockFixture, running: true, startedAt: KICKOFF_AT }

export const endedClockFixture: LiveClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FULL_TIME, elapsedSeconds: 1_530, firstHalfMinutes: 25, secondHalfMinutes: 25 }

export const endedWithoutRecordedClockFixture: LiveClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FULL_TIME }
