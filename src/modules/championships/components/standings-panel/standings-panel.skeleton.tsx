import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { StandingsTableSkeleton } from '../standings-table/standings-table.skeleton'
import { standingsPanelSkeletonStyles as skeletonStyles } from './standings-panel.skeleton.styles'
import { standingsPanelStyles as styles } from './standings-panel.styles'

const HEADER_DELAY_STEP_MS = 60
const LEGEND_DELAY_MS = 600

export function StandingsPanelSkeleton() {
  return (
    <section aria-hidden className={styles.panel}>
      <div className={styles.header}>
        <Skeleton className={cn(styles.title, skeletonStyles.title)} />
        <Skeleton className={cn(styles.roundsPlayed, skeletonStyles.roundsPlayed)} delayMs={HEADER_DELAY_STEP_MS} />
        <Skeleton className={cn(styles.hint, skeletonStyles.hint)} delayMs={HEADER_DELAY_STEP_MS * 2} />
      </div>
      <div className={styles.phase}>
        <StandingsTableSkeleton />
      </div>
      <div className={styles.legend}>
        <Skeleton className={skeletonStyles.legendKeys} delayMs={LEGEND_DELAY_MS} />
        <Skeleton className={skeletonStyles.legendResults} delayMs={LEGEND_DELAY_MS} />
      </div>
    </section>
  )
}
