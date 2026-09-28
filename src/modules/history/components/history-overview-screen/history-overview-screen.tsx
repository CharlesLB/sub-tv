import { ContextBar } from '@/modules/platform'
import { getHistoryOverview } from '../../data/get-history-overview'
import { type HistoryQuery, loadHistoryFilter } from '../../data/load-history-filter'
import { historyCrumbs } from '../../history-crumbs/history-crumbs'
import { formatRatio } from '../../stat-format/stat-format'
import { AccumulatedTable } from '../accumulated-table/accumulated-table'
import { HighlightCards } from '../highlight-cards/highlight-cards'
import { HistoryFilters } from '../history-filters/history-filters'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGrid } from '../kpi-grid/kpi-grid'
import { PeriodScorers } from '../period-scorers/period-scorers'

export const HISTORY_OVERVIEW_TITLE = 'Estatísticas gerais'

const OVERVIEW_TARGET = { kind: 'overview' } as const
const GOALS_PER_GAME_DIGITS = 1

export async function HistoryOverviewScreen({ query }: { query: HistoryQuery }) {
  const { filter, availableYears, seasonLabel } = await loadHistoryFilter(query)
  const overview = await getHistoryOverview(filter)

  const kpis = [
    { label: 'Campeonatos', value: String(overview.championshipCount) },
    { label: 'Partidas', value: String(overview.matchCount) },
    { label: 'Gols', value: String(overview.goalCount) },
    { label: 'Gols por jogo', value: formatRatio(overview.goalCount, overview.matchCount, GOALS_PER_GAME_DIGITS) },
  ]

  return (
    <>
      <ContextBar crumbs={historyCrumbs(OVERVIEW_TARGET, filter, seasonLabel, null)} title={HISTORY_OVERVIEW_TITLE} category={filter.category ?? undefined} />
      <HistoryFrame>
        <HistoryFilters filter={filter} availableYears={availableYears} target={OVERVIEW_TARGET} />
        <KpiGrid kpis={kpis} variant="overview" />
        <HighlightCards overview={overview} filter={filter} />
        <AccumulatedTable rows={overview.table} filter={filter} />
        <PeriodScorers scorers={overview.scorers} filter={filter} />
      </HistoryFrame>
    </>
  )
}
