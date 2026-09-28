import { seedStarterPositions } from '../../starter-positions/starter-positions'
import { lineupSidesFixture } from '../lineups-step/lineups-step.fixtures'
import type { BoardSideVM } from './lineup-board'

const ATTACKS_RIGHT = { home: true, away: false } as const

export const boardSidesFixture: BoardSideVM[] = lineupSidesFixture.map((lineupSide) => ({
  ...lineupSide,
  positions: seedStarterPositions(lineupSide.team, lineupSide.starterIds, ATTACKS_RIGHT[lineupSide.side]),
}))
