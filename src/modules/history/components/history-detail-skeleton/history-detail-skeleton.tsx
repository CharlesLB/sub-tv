import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { HistoryFiltersSkeleton } from '../history-filters-skeleton/history-filters-skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid-skeleton/kpi-grid-skeleton'
import { RowsSkeleton } from '../rows-skeleton/rows-skeleton'
import { historyDetailSkeletonStyles as styles } from './history-detail-skeleton.styles'

const KPI_COUNT = 4
const BAR_HEIGHT_PERCENTS = [48, 72, 60, 86, 54, 78, 66, 92] as const
const SEASON_ROW_COUNT = 5
const BAR_DELAY_STEP_MS = 40

export function HistoryDetailSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <div aria-hidden className={styles.content}>
        <Skeleton className={styles.backLink} />
        <div className={styles.hero}>
          <Skeleton className={styles.heroBadge} />
          <div className={styles.heroDetails}>
            <Skeleton className={styles.heroName} delayMs={60} />
            <Skeleton className={styles.heroSubtitle} delayMs={120} />
          </div>
        </div>
        <KpiGridSkeleton count={KPI_COUNT} variant="detail" />
        <div className={styles.chart}>
          <Skeleton className={styles.chartTitle} />
          <div className={styles.chartBars}>
            {BAR_HEIGHT_PERCENTS.map((heightPercent, index) => (
              <Skeleton key={index} className={styles.chartBar} delayMs={index * BAR_DELAY_STEP_MS} style={{ height: `${heightPercent}%` }} />
            ))}
          </div>
        </div>
        <RowsSkeleton rowCount={SEASON_ROW_COUNT} titleWidthClass={styles.seasonsTitleWidth} />
      </div>
    </HistoryFrame>
  )
}
