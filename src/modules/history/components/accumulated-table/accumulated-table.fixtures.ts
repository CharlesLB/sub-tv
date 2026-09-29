import { CREST_IMAGE_PATH } from '@/components/ui/crest/crest.fixtures'
import { CATEGORY, type TeamBadgeVM } from '@/modules/championships/client'
import type { AccumulatedTeamRowVM } from '../../types'

export const cruzeiroBadgeFixture: TeamBadgeVM = { name: 'Cruzeiro', abbreviation: 'CRU', color: '#1f4fa3', crestPath: CREST_IMAGE_PATH }
export const atleticoBadgeFixture: TeamBadgeVM = { name: 'Atlético', abbreviation: 'CAM', color: '#2b2b2b', crestPath: null }
export const tupiBadgeFixture: TeamBadgeVM = { name: 'Tupi', abbreviation: 'TUP', color: '#c89b00', crestPath: null }

export const cruzeiroRowFixture: AccumulatedTeamRowVM = {
  teamKey: 'sub14-2d9c4f1a-7b3e-4c8a-9f10-5e6d7c8b9a01',
  category: CATEGORY.SUB14,
  team: cruzeiroBadgeFixture,
  played: 24,
  wins: 18,
  draws: 4,
  losses: 2,
  goalsFor: 61,
  goalsAgainst: 14,
  points: 58,
  goalDifference: 47,
  winRate: 81,
}

export const atleticoRowFixture: AccumulatedTeamRowVM = {
  teamKey: 'sub13-8a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
  category: CATEGORY.SUB13,
  team: atleticoBadgeFixture,
  played: 26,
  wins: 14,
  draws: 5,
  losses: 7,
  goalsFor: 40,
  goalsAgainst: 28,
  points: 47,
  goalDifference: 12,
  winRate: 60,
}

export const tupiRowFixture: AccumulatedTeamRowVM = {
  teamKey: 'sub14-5f4e3d2c-1b0a-4f9e-8d7c-6b5a4f3e2d1c',
  category: CATEGORY.SUB14,
  team: tupiBadgeFixture,
  played: 20,
  wins: 4,
  draws: 3,
  losses: 13,
  goalsFor: 15,
  goalsAgainst: 39,
  points: 15,
  goalDifference: -24,
  winRate: 25,
}

export const accumulatedTeamRowsFixture: AccumulatedTeamRowVM[] = [cruzeiroRowFixture, atleticoRowFixture, tupiRowFixture]
