import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { athleteHeroSkeletonStyles as skeletonStyles } from './athlete-hero.skeleton.styles'
import { athleteHeroStyles as styles } from './athlete-hero.styles'

const LINE_DELAY_STEP_MS = 60

export function AthleteHeroSkeleton() {
  return (
    <div aria-hidden className={styles.card}>
      <Skeleton className={skeletonStyles.shirtNumber} />
      <div className={styles.details}>
        <div className={styles.line}>
          <Skeleton className={cn(styles.name, skeletonStyles.name)} delayMs={LINE_DELAY_STEP_MS} />
          <Skeleton className={cn(styles.nickname, skeletonStyles.nickname)} delayMs={LINE_DELAY_STEP_MS} />
        </div>
        <div className={styles.line}>
          <Skeleton className={cn(styles.position, skeletonStyles.position)} delayMs={2 * LINE_DELAY_STEP_MS} />
          <Skeleton className={cn(styles.teamLine, skeletonStyles.teamLine)} delayMs={2 * LINE_DELAY_STEP_MS} />
        </div>
        <Skeleton className={cn(styles.subtitle, skeletonStyles.subtitle)} delayMs={3 * LINE_DELAY_STEP_MS} />
      </div>
    </div>
  )
}
