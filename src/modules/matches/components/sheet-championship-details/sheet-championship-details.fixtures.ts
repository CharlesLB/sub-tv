import { CATEGORY, type ChampionshipHeaderVM } from '@/modules/championships/client'

export const championshipHeaderFixture: ChampionshipHeaderVM = {
  id: '3b1f6c2e-8a4d-4f0e-9c7b-5d2a1e0f6b34',
  name: 'Campeonato Mineiro Sub-14',
  category: CATEGORY.SUB14,
  year: 2026,
  label: 'Mineiro Sub-14 2026',
  statusLine: 'Rodada 7 de 14',
  teamCount: 12,
  currentRound: 7,
  isFinished: false,
}
