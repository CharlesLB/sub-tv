import { CATEGORY } from '@/modules/championships/client'
import {
  DATA_SOURCE,
  GOAL_TYPE,
  HALF_LENGTH_MINUTES,
  INITIAL_LIVE_CLOCK,
  LIVE_EVENT_TYPE,
  MATCH_PERIOD,
  MATCH_STATUS,
  SIDE,
  type LiveEventVM,
  type LiveMatchSnapshot,
  type LivePlayerVM,
  type Side,
} from '@/modules/matches/client'

export const makePlayer = (overrides: Partial<LivePlayerVM> & { playerId: string; side: Side; shirtNumber: number }): LivePlayerVM => ({
  name: `Atleta ${overrides.shirtNumber}`,
  shortName: `Atleta${overrides.shirtNumber}`,
  nickname: null,
  position: null,
  preferredFoot: null,
  isStarter: true,
  isCaptain: false,
  pitchPoint: { x: 30, y: 50 },
  season: { goals: 0, assists: 0, yellowCards: 0, games: 0 },
  curiosities: [],
  ...overrides,
})

export const makeEvent = (overrides: Partial<LiveEventVM> & { key: string; type: LiveEventVM['type']; side: Side }): LiveEventVM => ({
  period: MATCH_PERIOD.FIRST_HALF,
  minute: 10,
  playerId: null,
  playerOutId: null,
  assistPlayerId: null,
  goalType: overrides.type === LIVE_EVENT_TYPE.GOAL ? GOAL_TYPE.NORMAL : null,
  fromSecondYellow: false,
  source: DATA_SOURCE.FMF,
  appliedToLineup: false,
  ...overrides,
})

export const PLAYER = {
  HOME_STRIKER: 'home-9',
  HOME_MIDFIELDER: 'home-10',
  HOME_RESERVE: 'home-12',
  AWAY_STRIKER: 'away-9',
  AWAY_RESERVE: 'away-12',
} as const

export const makeSnapshot = (overrides: Partial<LiveMatchSnapshot> = {}): LiveMatchSnapshot => ({
  matchId: 'match-1',
  seasonId: 'season-1',
  status: MATCH_STATUS.SCHEDULED,
  round: 7,
  phase: null,
  kickoffAt: null,
  venue: 'Estádio Municipal',
  city: null,
  halfLengthMinutes: HALF_LENGTH_MINUTES,
  clock: INITIAL_LIVE_CLOCK,
  championship: { name: 'Regional da Base', category: CATEGORY.SUB14, year: 2026 },
  officials: [],
  teams: {
    [SIDE.HOME]: { side: SIDE.HOME, seasonTeamId: 'team-home', name: 'União FC', abbreviation: 'UNI', color: '#C4411B' },
    [SIDE.AWAY]: { side: SIDE.AWAY, seasonTeamId: 'team-away', name: 'Serra Azul', abbreviation: 'SER', color: '#1F6A4A' },
  },
  players: [
    makePlayer({ playerId: PLAYER.HOME_STRIKER, side: SIDE.HOME, shirtNumber: 9, pitchPoint: { x: 44, y: 50 } }),
    makePlayer({ playerId: PLAYER.HOME_MIDFIELDER, side: SIDE.HOME, shirtNumber: 10, pitchPoint: { x: 32, y: 30 } }),
    makePlayer({ playerId: PLAYER.HOME_RESERVE, side: SIDE.HOME, shirtNumber: 12, isStarter: false, pitchPoint: null }),
    makePlayer({ playerId: PLAYER.AWAY_STRIKER, side: SIDE.AWAY, shirtNumber: 9, pitchPoint: { x: 56, y: 50 } }),
    makePlayer({ playerId: PLAYER.AWAY_RESERVE, side: SIDE.AWAY, shirtNumber: 12, isStarter: false, pitchPoint: null }),
  ],
  events: [],
  ...overrides,
})
