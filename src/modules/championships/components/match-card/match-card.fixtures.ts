import { MATCH_STATUS } from '../../lib/match-status/match-status'
import type { MatchCardVM, TeamBadgeVM } from '../../types'

export const SEASON_ID_FIXTURE = '3b1f2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
export const FIRST_PHASE_FIXTURE = '1ª FASE'

export const valeVerdeBadgeFixture: TeamBadgeVM = { name: 'Vale Verde EC', abbreviation: 'VVE', color: '#1f7a4d', crestPath: null }
export const serranoBadgeFixture: TeamBadgeVM = { name: 'Serrano FC', abbreviation: 'SER', color: '#b3261e', crestPath: null }
export const ribeirinhaBadgeFixture: TeamBadgeVM = { name: 'União Ribeirinha', abbreviation: 'UNR', color: '#1f4fa3', crestPath: null }
export const cerradoBadgeFixture: TeamBadgeVM = { name: 'Atlético Cerrado', abbreviation: 'ACE', color: '#6b3fa0', crestPath: null }

export const finishedMatchFixture: MatchCardVM = {
  id: '9a8b7c6d-1111-4e2f-8a3b-4c5d6e7f8a01',
  phase: FIRST_PHASE_FIXTURE,
  round: 3,
  matchNumber: 11,
  kickoffAt: '2025-04-12T18:00:00.000Z',
  venue: 'Estádio Municipal',
  city: 'Contagem',
  status: MATCH_STATUS.FINISHED,
  isBroadcast: false,
  homeTeamId: 'home-vale-verde',
  awayTeamId: 'away-serrano',
  home: valeVerdeBadgeFixture,
  away: serranoBadgeFixture,
  homeScore: 2,
  awayScore: 1,
  homePenalties: null,
  awayPenalties: null,
}

export const penaltiesMatchFixture: MatchCardVM = {
  ...finishedMatchFixture,
  id: '9a8b7c6d-2222-4e2f-8a3b-4c5d6e7f8a02',
  homeScore: 1,
  awayScore: 1,
  homePenalties: 4,
  awayPenalties: 3,
}

export const liveMatchFixture: MatchCardVM = {
  ...finishedMatchFixture,
  id: '9a8b7c6d-3333-4e2f-8a3b-4c5d6e7f8a03',
  status: MATCH_STATUS.LIVE,
  isBroadcast: true,
  home: ribeirinhaBadgeFixture,
  away: cerradoBadgeFixture,
  homeScore: 0,
  awayScore: 1,
}

export const scheduledMatchFixture: MatchCardVM = {
  ...finishedMatchFixture,
  id: '9a8b7c6d-4444-4e2f-8a3b-4c5d6e7f8a04',
  round: 4,
  kickoffAt: '2025-04-19T13:30:00.000Z',
  venue: null,
  city: null,
  status: MATCH_STATUS.SCHEDULED,
  homeScore: null,
  awayScore: null,
}

export const undatedMatchFixture: MatchCardVM = {
  ...scheduledMatchFixture,
  id: '9a8b7c6d-5555-4e2f-8a3b-4c5d6e7f8a05',
  phase: null,
  round: null,
  kickoffAt: null,
  status: MATCH_STATUS.POSTPONED,
}

export const cancelledMatchFixture: MatchCardVM = { ...scheduledMatchFixture, id: '9a8b7c6d-6666-4e2f-8a3b-4c5d6e7f8a06', status: MATCH_STATUS.CANCELLED }
