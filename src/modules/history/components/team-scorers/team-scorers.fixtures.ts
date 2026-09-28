import type { TeamScorerVM } from '../../types'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'

export const teamScorersFixture: TeamScorerVM[] = [
  { playerId: athleteHistoryFixture.playerId, name: athleteHistoryFixture.name, goals: 17, games: 24 },
  { playerId: '3e2d1c0b-9a8f-4e7d-8c6b-5a4f3e2d1c0b', name: 'Mateus Ribeiro', goals: 9, games: 21 },
  { playerId: '7a6b5c4d-3e2f-4a1b-9c0d-8e7f6a5b4c3d', name: 'Davi Carvalho', goals: 3, games: 12 },
]
