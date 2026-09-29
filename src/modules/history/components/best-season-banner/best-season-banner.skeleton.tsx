import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { bestSeasonBannerSkeletonStyles as skeletonStyles } from './best-season-banner.skeleton.styles'
import { bestSeasonBannerStyles as styles } from './best-season-banner.styles'

const TEXT_DELAY_MS = 60

export function BestSeasonBannerSkeleton() {
  return (
    <div aria-hidden className={styles.banner}>
      <Skeleton className={skeletonStyles.icon} />
      <Skeleton className={skeletonStyles.text} delayMs={TEXT_DELAY_MS} />
    </div>
  )
}
