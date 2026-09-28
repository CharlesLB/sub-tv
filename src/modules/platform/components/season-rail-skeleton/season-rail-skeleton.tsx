import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { seasonRailSkeletonStyles as styles } from './season-rail-skeleton.styles'

export function SeasonRailSkeleton() {
  return (
    <div aria-hidden className={styles.rail}>
      <Skeleton className={styles.seasonButton} />
      <Skeleton className={styles.yearAxis} delayMs={80} />
      <span className={styles.divider} />
      <Skeleton className={styles.championshipChip} delayMs={160} />
      <Skeleton className={styles.championshipChip} delayMs={240} />
    </div>
  )
}
