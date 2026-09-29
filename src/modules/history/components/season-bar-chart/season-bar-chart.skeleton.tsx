import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { seasonBarChartSkeletonStyles as skeletonStyles } from './season-bar-chart.skeleton.styles'
import { seasonBarChartStyles as styles } from './season-bar-chart.styles'

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

const BAR_DELAY_STEP_MS = 40

type SeasonBarChartSkeletonProps = { barCount: number; trackHeightClass: string }

export function SeasonBarChartSkeleton({ barCount, trackHeightClass }: SeasonBarChartSkeletonProps) {
  return (
    <div aria-hidden className={styles.chart}>
      <Skeleton className={cn(styles.title, skeletonStyles.title)} />
      <div className={styles.bars}>
        {BAR_PLACEHOLDERS.slice(0, barCount).map((bar, order) => (
          <span key={bar.barId} className={styles.column}>
            <Skeleton className={cn(styles.value, skeletonStyles.value)} delayMs={order * BAR_DELAY_STEP_MS} />
            <span className={cn(styles.track, trackHeightClass)}>
              <Skeleton className={skeletonStyles.bar} delayMs={order * BAR_DELAY_STEP_MS} style={{ height: `${bar.heightPercent}%` }} />
            </span>
            <Skeleton className={cn(styles.year, skeletonStyles.year)} delayMs={order * BAR_DELAY_STEP_MS} />
          </span>
        ))}
      </div>
    </div>
  )
}
