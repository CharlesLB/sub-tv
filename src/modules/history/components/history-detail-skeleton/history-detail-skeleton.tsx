import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { HistoryFiltersSkeleton } from '../history-filters-skeleton/history-filters-skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid-skeleton/kpi-grid-skeleton'
import { RowsSkeleton } from '../rows-skeleton/rows-skeleton'
import { historyDetailSkeletonStyles as styles } from './history-detail-skeleton.styles'

const KPI_COUNT = 4

const BAR_PLACEHOLDERS = [
  { barId: 'first-bar', heightPercent: 48 },
  { barId: 'second-bar', heightPercent: 72 },
  { barId: 'third-bar', heightPercent: 60 },
  { barId: 'fourth-bar', heightPercent: 86 },
  { barId: 'fifth-bar', heightPercent: 54 },
  { barId: 'sixth-bar', heightPercent: 78 },
  { barId: 'seventh-bar', heightPercent: 66 },
  { barId: 'eighth-bar', heightPercent: 92 },
] as const

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
            {BAR_PLACEHOLDERS.map((bar, order) => (
              <Skeleton key={bar.barId} className={styles.chartBar} delayMs={order * BAR_DELAY_STEP_MS} style={{ height: `${bar.heightPercent}%` }} />
            ))}
          </div>
        </div>
        <RowsSkeleton rowCount={SEASON_ROW_COUNT} titleWidthClass={styles.seasonsTitleWidth} />
      </div>
    </HistoryFrame>
  )
}
