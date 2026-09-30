import { CATEGORY } from '@/modules/championships/client'
import { toTeamKey } from '../../lib/team-key/team-key'
import type { SeasonTeamVM } from '../../types'

const FIRST_CLUB_ID = '2d6f8a1c-4b7e-4c93-9f0a-6e1b3d5c7a82'
const SECOND_CLUB_ID = '8b3e5d7f-9a1c-4e2b-b6d8-0f2a4c6e8b19'

export const seasonTeamFixture: SeasonTeamVM = {
  key: toTeamKey(CATEGORY.SUB14, FIRST_CLUB_ID),
  clubId: FIRST_CLUB_ID,
  category: CATEGORY.SUB14,
  badge: { name: 'Estrela do Vale', abbreviation: 'EDV', color: '#1f4fa3', crestPath: null },
  athleteCount: 24,
}

export const secondSeasonTeamFixture: SeasonTeamVM = {
  key: toTeamKey(CATEGORY.SUB13, SECOND_CLUB_ID),
  clubId: SECOND_CLUB_ID,
  category: CATEGORY.SUB13,
  badge: { name: 'Serra Azul FC', abbreviation: 'SAF', color: '#c8102e', crestPath: null },
  athleteCount: 19,
}

export const seasonTeamsFixture: SeasonTeamVM[] = [seasonTeamFixture, secondSeasonTeamFixture]
