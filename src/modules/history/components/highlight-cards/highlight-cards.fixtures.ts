import type { HistoryOverviewVM } from '../../types'
import { accumulatedTeamRowsFixture, atleticoRowFixture, cruzeiroRowFixture } from '../accumulated-table/accumulated-table.fixtures'
import { periodScorersFixture } from '../period-scorers/period-scorers.fixtures'

export const historyOverviewFixture: HistoryOverviewVM = {
  championshipCount: 6,
  matchCount: 180,
  goalCount: 540,
  bestWinRate: cruzeiroRowFixture,
  mostGames: atleticoRowFixture,
  table: accumulatedTeamRowsFixture,
  scorers: periodScorersFixture,
}

export const emptyHistoryOverviewFixture: HistoryOverviewVM = {
  championshipCount: 0,
  matchCount: 0,
  goalCount: 0,
  bestWinRate: null,
  mostGames: null,
  table: [],
  scorers: [],
}
