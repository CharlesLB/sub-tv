import { CATEGORY } from '../../lib/categories/categories'
import type { ChampionshipHeaderVM } from '../../types'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'

export const championshipHeaderFixture: ChampionshipHeaderVM = {
  id: SEASON_ID_FIXTURE,
  name: 'Copa do Vale',
  category: CATEGORY.SUB14,
  year: 2025,
  label: 'Copa do Vale 2025',
  statusLine: '2025 · 1ª Fase · rodada 3',
  teamCount: 6,
  currentRound: 3,
  isFinished: false,
}
