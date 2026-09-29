import { AccumulatedTableSkeleton } from '../accumulated-table/accumulated-table.skeleton'
import { HighlightCardsSkeleton } from '../highlight-cards/highlight-cards.skeleton'
import { HistoryFiltersSkeleton } from '../history-filters/history-filters.skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid/kpi-grid.skeleton'
import { PeriodScorersSkeleton } from '../period-scorers/period-scorers.skeleton'

export function HistoryOverviewScreenSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <KpiGridSkeleton variant="overview" />
      <HighlightCardsSkeleton />
      <AccumulatedTableSkeleton />
      <PeriodScorersSkeleton />
    </HistoryFrame>
  )
}
