import { CATEGORY } from '@/modules/championships/client'
import { toTeamKey } from '@/modules/teams/client'
import type { TeamSquadVM } from '../../types'
import { secondSquadPlayerFixture, squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'

const CLUB_ID = '2d6f8a1c-4b7e-4c93-9f0a-6e1b3d5c7a82'

export const teamSquadFixture: TeamSquadVM = {
  key: toTeamKey(CATEGORY.SUB14, CLUB_ID),
  clubId: CLUB_ID,
  category: CATEGORY.SUB14,
  year: 2025,
  badge: { name: 'Estrela do Vale', abbreviation: 'EDV', color: '#1f4fa3', crestPath: null },
  otherCategoryKey: toTeamKey(CATEGORY.SUB13, CLUB_ID),
  players: [squadPlayerFixture, secondSquadPlayerFixture, squadPlayerWithoutDetailsFixture],
}

export const emptyTeamSquadFixture: TeamSquadVM = { ...teamSquadFixture, players: [] }
