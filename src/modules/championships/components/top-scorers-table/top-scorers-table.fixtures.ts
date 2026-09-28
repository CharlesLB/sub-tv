import type { TopScorerVM } from '../../types'
import { serranoBadgeFixture, valeVerdeBadgeFixture } from '../match-card/match-card.fixtures'

export const topScorerFixture: TopScorerVM = {
  playerId: 'p0000002-aaaa-4bbb-8ccc-000000000009',
  seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000001',
  shirtNumber: 9,
  name: 'Miguel Bastos',
  nickname: 'Miguelzinho',
  position: 'Atacante',
  team: valeVerdeBadgeFixture,
  goals: 8,
  games: 5,
}

export const runnerUpScorerFixture: TopScorerVM = {
  playerId: 'p0000002-aaaa-4bbb-8ccc-000000000011',
  seasonTeamId: 'st000001-aaaa-4bbb-8ccc-000000000002',
  shirtNumber: null,
  name: 'Arthur Lacerda',
  nickname: null,
  position: null,
  team: serranoBadgeFixture,
  goals: 5,
  games: 5,
}

export const topScorersFixture: TopScorerVM[] = [topScorerFixture, runnerUpScorerFixture]
