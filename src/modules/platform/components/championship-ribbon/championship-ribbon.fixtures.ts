import { CATEGORY, type ChampionshipRibbonItemVM } from '@/modules/championships/client'

export const championshipRibbonFixture: ChampionshipRibbonItemVM[] = [
  { id: '0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d01', name: 'Mineiro Sub-14', category: CATEGORY.SUB14, year: 2024, lastActivityAt: '2024-10-20T15:00:00Z', isFinished: true },
  { id: '0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d02', name: 'Mineiro Sub-13', category: CATEGORY.SUB13, year: 2024, lastActivityAt: '2024-09-14T15:00:00Z', isFinished: true },
  { id: '0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d03', name: 'Taça Serra Azul Sub-14', category: CATEGORY.SUB14, year: 2024, lastActivityAt: null, isFinished: false },
  { id: '0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d04', name: 'Copa Vale do Aço Sub-13', category: CATEGORY.SUB13, year: 2024, lastActivityAt: '2024-06-02T15:00:00Z', isFinished: true },
  { id: '0b6f3f0e-6c1a-4c55-9a51-1f0d2b3c4d05', name: 'Torneio Campos das Vertentes Sub-14', category: CATEGORY.SUB14, year: 2024, lastActivityAt: '2024-04-27T15:00:00Z', isFinished: true },
]

export const activeChampionshipIdFixture = championshipRibbonFixture[0]?.id ?? null
