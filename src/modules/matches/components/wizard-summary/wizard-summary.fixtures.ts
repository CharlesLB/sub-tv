import { awayTeamFixture, homeTeamFixture } from '../lineup-card/lineup-card.fixtures'
import type { SummarySideVM } from './wizard-summary'

export const summarySidesFixture: SummarySideVM[] = [
  { key: 'home', name: homeTeamFixture.name, color: homeTeamFixture.color, crestPath: homeTeamFixture.crestPath, lineupCount: '11/11' },
  { key: 'away', name: awayTeamFixture.name, color: awayTeamFixture.color, crestPath: awayTeamFixture.crestPath, lineupCount: '9/11' },
]

export const summaryLinesFixture: string[] = ['Mineiro · R7', '03/10/2026 · 10:00', 'Arena do Vale · campo 2', 'Tempo de jogo 2 × 30 min']
