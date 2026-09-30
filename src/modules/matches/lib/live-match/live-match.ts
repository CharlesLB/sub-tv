import type { Category, MatchStatus } from '@/modules/championships/client'
import type { PitchPoint, PlayerPosition } from '../pitch-layout/pitch-layout'

export const HALF_LENGTH_MINUTES = 30
export const MAXIMUM_EVENT_MINUTE = 130

export const SIDE = { HOME: 'home', AWAY: 'away' } as const

export type Side = (typeof SIDE)[keyof typeof SIDE]

export const SIDES: readonly Side[] = [SIDE.HOME, SIDE.AWAY]

export const opponentSide: Record<Side, Side> = { [SIDE.HOME]: SIDE.AWAY, [SIDE.AWAY]: SIDE.HOME }

export const LIVE_EVENT_TYPE = {
  GOAL: 'gol',
  YELLOW_CARD: 'amarelo',
  RED_CARD: 'vermelho',
  SUBSTITUTION: 'substituicao',
} as const

export type LiveEventType = (typeof LIVE_EVENT_TYPE)[keyof typeof LIVE_EVENT_TYPE]

export const GOAL_TYPE = { NORMAL: 'normal', PENALTY: 'penalti', OWN_GOAL: 'contra', FREE_KICK: 'falta' } as const

export type GoalType = (typeof GOAL_TYPE)[keyof typeof GOAL_TYPE]

export const MATCH_PERIOD = {
  BEFORE_START: 'ANT',
  FIRST_HALF: '1T',
  HALF_TIME: 'INT',
  SECOND_HALF: '2T',
  FIRST_EXTRA_HALF: 'PR1',
  SECOND_EXTRA_HALF: 'PR2',
  PENALTIES: 'PEN',
  FULL_TIME: 'TER',
} as const

export type MatchPeriod = (typeof MATCH_PERIOD)[keyof typeof MATCH_PERIOD]

export type ClockPeriod = typeof MATCH_PERIOD.BEFORE_START | typeof MATCH_PERIOD.FIRST_HALF | typeof MATCH_PERIOD.HALF_TIME | typeof MATCH_PERIOD.SECOND_HALF | typeof MATCH_PERIOD.FULL_TIME

export const PREFERRED_FOOT = { RIGHT: 'destro', LEFT: 'canhoto', BOTH: 'ambidestro' } as const

export type PreferredFoot = (typeof PREFERRED_FOOT)[keyof typeof PREFERRED_FOOT]

export const DATA_SOURCE = { FMF: 'fmf', MANUAL: 'manual', LIVE: 'ao_vivo' } as const

export type DataSource = (typeof DATA_SOURCE)[keyof typeof DATA_SOURCE]

export type LiveClock = {
  period: ClockPeriod
  running: boolean
  startedAt: string | null
  elapsedSeconds: number
  addedMinutes: number
  firstHalfMinutes: number | null
  secondHalfMinutes: number | null
}

export type LiveTeamVM = {
  side: Side
  seasonTeamId: string
  name: string
  abbreviation: string
  color: string
  crestPath: string | null
}

export type SeasonNumbersVM = { goals: number; assists: number; yellowCards: number; games: number }

export type LivePlayerVM = {
  playerId: string
  side: Side
  shirtNumber: number
  name: string
  shortName: string
  nickname: string | null
  position: PlayerPosition | null
  preferredFoot: PreferredFoot | null
  isStarter: boolean
  isCaptain: boolean
  pitchPoint: PitchPoint | null
  season: SeasonNumbersVM
  curiosities: string[]
}

export type LiveEventVM = {
  key: string
  side: Side
  type: LiveEventType
  period: MatchPeriod
  minute: number | null
  playerId: string | null
  playerOutId: string | null
  assistPlayerId: string | null
  goalType: GoalType | null
  fromSecondYellow: boolean
  source: DataSource
  appliedToLineup: boolean
}

export type LiveOfficialVM = { label: string; name: string }

export type LiveMatchSnapshot = {
  matchId: string
  seasonId: string
  status: MatchStatus
  round: number | null
  phase: string | null
  kickoffAt: string | null
  venue: string | null
  city: string | null
  halfLengthMinutes: number
  clock: LiveClock
  championship: { name: string; category: Category; year: number }
  officials: LiveOfficialVM[]
  teams: Record<Side, LiveTeamVM>
  players: LivePlayerVM[]
  events: LiveEventVM[]
}
