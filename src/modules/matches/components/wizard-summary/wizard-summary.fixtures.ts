import { awayTeamFixture, homeTeamFixture } from '../lineup-card/lineup-card.fixtures'
import { SUMMARY_LINE, type SummaryLineVM } from '../../wizard-selectors/wizard-selectors'
import type { SummarySideVM } from './wizard-summary'

export const summarySidesFixture: SummarySideVM[] = [
  { key: 'home', name: homeTeamFixture.name, color: homeTeamFixture.color, crestPath: homeTeamFixture.crestPath, lineupCount: '11/11' },
  { key: 'away', name: awayTeamFixture.name, color: awayTeamFixture.color, crestPath: awayTeamFixture.crestPath, lineupCount: '9/11' },
]

export const summaryLinesFixture: SummaryLineVM[] = [
  { id: SUMMARY_LINE.CHAMPIONSHIP, text: 'Mineiro · R7' },
  { id: SUMMARY_LINE.KICKOFF, text: '03/10/2026 · 10:00' },
  { id: SUMMARY_LINE.VENUE, text: 'Arena do Vale · campo 2' },
  { id: SUMMARY_LINE.DURATION, text: 'Tempo de jogo 2 × 30 min' },
]
