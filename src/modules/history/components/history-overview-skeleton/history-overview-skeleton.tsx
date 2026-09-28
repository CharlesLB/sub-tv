import { HistoryFiltersSkeleton } from '../history-filters-skeleton/history-filters-skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid-skeleton/kpi-grid-skeleton'
import { RowsSkeleton } from '../rows-skeleton/rows-skeleton'
import { historyOverviewSkeletonStyles as styles } from './history-overview-skeleton.styles'

const KPI_COUNT = 4
const HIGHLIGHT_COUNT = 3
const TABLE_ROW_COUNT = 8

export function HistoryOverviewSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <KpiGridSkeleton count={KPI_COUNT} variant="overview" />
      <KpiGridSkeleton count={HIGHLIGHT_COUNT} variant="highlight" className={styles.highlights} />
      <RowsSkeleton rowCount={TABLE_ROW_COUNT} titleWidthClass={styles.tableTitleWidth} className={styles.table} />
    </HistoryFrame>
  )
}
