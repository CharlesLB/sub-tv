import { FORM_RESULT } from '../../form-result/form-result'
import type { SquadPreviewPlayerVM, StandingRowVM } from '../../types'
import { cerradoBadgeFixture, ribeirinhaBadgeFixture, serranoBadgeFixture, valeVerdeBadgeFixture } from '../match-card/match-card.fixtures'

export const squadPreviewFixture: SquadPreviewPlayerVM[] = [
  { playerId: 'p0000001-aaaa-4bbb-8ccc-000000000001', shirtNumber: 1, name: 'Enzo Carvalho', position: 'Goleiro' },
  { playerId: 'p0000001-aaaa-4bbb-8ccc-000000000010', shirtNumber: 10, name: 'Davi Monteiro', position: 'Meia' },
  { playerId: 'p0000001-aaaa-4bbb-8ccc-000000000099', shirtNumber: null, name: 'Heitor Nogueira', position: null },
]

export const leaderRowFixture: StandingRowVM = {
  position: 1,
  seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000001',
  clubId: 'c1a2b3c4-0001-4d5e-8f90-a1b2c3d4e5f1',
  team: valeVerdeBadgeFixture,
  points: 13,
  played: 5,
  wins: 4,
  draws: 1,
  losses: 0,
  goalsFor: 12,
  goalsAgainst: 4,
  goalDifference: 8,
  form: [FORM_RESULT.WIN, FORM_RESULT.WIN, FORM_RESULT.DRAW, FORM_RESULT.WIN, FORM_RESULT.WIN],
  squad: squadPreviewFixture,
}

export const middleRowFixture: StandingRowVM = {
  ...leaderRowFixture,
  position: 5,
  seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000005',
  clubId: 'c1a2b3c4-0003-4d5e-8f90-a1b2c3d4e5f3',
  team: ribeirinhaBadgeFixture,
  points: 6,
  wins: 1,
  draws: 3,
  losses: 1,
  goalsFor: 5,
  goalsAgainst: 5,
  goalDifference: 0,
  form: [FORM_RESULT.DRAW, FORM_RESULT.LOSS, FORM_RESULT.DRAW, FORM_RESULT.WIN, FORM_RESULT.DRAW],
  squad: [],
}

export const bottomRowFixture: StandingRowVM = {
  ...leaderRowFixture,
  position: 6,
  seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000006',
  clubId: 'c1a2b3c4-0004-4d5e-8f90-a1b2c3d4e5f4',
  team: cerradoBadgeFixture,
  points: 1,
  wins: 0,
  draws: 1,
  losses: 4,
  goalsFor: 2,
  goalsAgainst: 9,
  goalDifference: -7,
  form: [FORM_RESULT.LOSS, FORM_RESULT.LOSS, FORM_RESULT.DRAW, FORM_RESULT.LOSS, FORM_RESULT.LOSS],
}

export const standingRowsFixture: StandingRowVM[] = [
  leaderRowFixture,
  { ...leaderRowFixture, position: 2, seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000002', team: serranoBadgeFixture, points: 10, goalDifference: 4 },
  { ...middleRowFixture, position: 3, seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000003', team: { ...serranoBadgeFixture, name: 'Estrela do Norte', abbreviation: 'EDN' }, points: 8 },
  { ...middleRowFixture, position: 4, seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000004', team: { ...ribeirinhaBadgeFixture, name: 'Real Mantiqueira', abbreviation: 'RMA' }, points: 7 },
  middleRowFixture,
  bottomRowFixture,
]
