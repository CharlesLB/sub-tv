import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { teamHeroSkeletonStyles as skeletonStyles } from './team-hero.skeleton.styles'
import { teamHeroStyles as styles } from './team-hero.styles'

const LINE_DELAY_STEP_MS = 60

export function TeamHeroSkeleton() {
  return (
    <div aria-hidden className={styles.card}>
      <Skeleton className={skeletonStyles.badge} />
      <div className={styles.details}>
        <div className={styles.line}>
          <Skeleton className={cn(styles.name, skeletonStyles.name)} delayMs={LINE_DELAY_STEP_MS} />
          <Skeleton className={cn(styles.category, skeletonStyles.category)} delayMs={LINE_DELAY_STEP_MS} />
        </div>
        <Skeleton className={cn(styles.subtitle, skeletonStyles.subtitle)} delayMs={2 * LINE_DELAY_STEP_MS} />
      </div>
    </div>
  )
}
