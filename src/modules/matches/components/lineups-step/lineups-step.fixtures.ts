import { awayTeamFixture, homeTeamFixture } from '../lineup-card/lineup-card.fixtures'
import type { LineupSideVM } from './lineups-step'

const INCOMPLETE_STARTER_COUNT = 9

export const lineupSidesFixture: LineupSideVM[] = [
  { side: 'home', team: homeTeamFixture, starterIds: homeTeamFixture.defaultStarterIds },
  { side: 'away', team: awayTeamFixture, starterIds: awayTeamFixture.defaultStarterIds.slice(0, INCOMPLETE_STARTER_COUNT) },
]
