import { CATEGORY } from '@/modules/championships/client'
import type { PeriodScorerVM } from '../../types'
import { atleticoBadgeFixture, cruzeiroBadgeFixture, tupiBadgeFixture } from '../accumulated-table/accumulated-table.fixtures'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'

export const topPeriodScorerFixture: PeriodScorerVM = {
  playerId: athleteHistoryFixture.playerId,
  name: athleteHistoryFixture.name,
  category: CATEGORY.SUB14,
  team: cruzeiroBadgeFixture,
  goals: 17,
  games: 24,
  seasonCount: 2,
}

export const periodScorersFixture: PeriodScorerVM[] = [
  topPeriodScorerFixture,
  { playerId: '0b7e6c5d-4a3f-4e2d-9c1b-8a7f6e5d4c3b', name: 'Gabriel Tavares', category: CATEGORY.SUB13, team: atleticoBadgeFixture, goals: 12, games: 20, seasonCount: 1 },
  { playerId: '9c8d7e6f-5a4b-4c3d-8e2f-1a0b9c8d7e6f', name: 'Enzo Figueiredo', category: CATEGORY.SUB14, team: tupiBadgeFixture, goals: 5, games: 18, seasonCount: 2 },
]
