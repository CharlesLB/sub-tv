import { CATEGORY } from '@/modules/championships/client'
import type { TeamHistoryVM } from '../../types'
import { cruzeiroBadgeFixture, cruzeiroRowFixture } from '../accumulated-table/accumulated-table.fixtures'
import { competitionPresencesFixture } from '../competition-presence-list/competition-presence-list.fixtures'
import { teamSeasonsFixture } from '../team-campaign/team-campaign.fixtures'
import { teamScorersFixture } from '../team-scorers/team-scorers.fixtures'

export const teamHistoryFixture: TeamHistoryVM = {
  teamKey: cruzeiroRowFixture.teamKey,
  category: CATEGORY.SUB14,
  team: cruzeiroBadgeFixture,
  totals: { played: 24, wins: 18, draws: 4, losses: 2, goalsFor: 61, goalsAgainst: 14, points: 58, goalDifference: 47, winRate: 81 },
  seasons: teamSeasonsFixture,
  scorers: teamScorersFixture,
  presences: competitionPresencesFixture,
}

export const teamWithoutSeasonsFixture: TeamHistoryVM = {
  ...teamHistoryFixture,
  totals: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, goalDifference: 0, winRate: 0 },
  seasons: [],
  scorers: [],
  presences: [],
}

export const teamWithoutCrestFixture: TeamHistoryVM = { ...teamHistoryFixture, team: { ...teamHistoryFixture.team, crestPath: null } }
