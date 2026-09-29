import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { RoundMatchCardSkeleton } from '../round-match-card/round-match-card.skeleton'
import { roundPanelSkeletonStyles as skeletonStyles } from './round-panel.skeleton.styles'
import { roundPanelStyles as styles } from './round-panel.styles'

const ROUND_CARD_COUNT = 3
const ALL_ROUNDS_DELAY_MS = 400

export function RoundPanelSkeleton() {
  return (
    <aside aria-hidden className={styles.panel}>
      <div className={styles.header}>
        <Skeleton className={cn(styles.title, skeletonStyles.title)} />
        <Skeleton className={cn(styles.matchCount, skeletonStyles.matchCount)} />
      </div>
      {skeletonSlots(ROUND_CARD_COUNT).map(({ slotId, order }) => (
        <RoundMatchCardSkeleton key={slotId} index={order} />
      ))}
      <div className={styles.allRoundsLink}>
        <Skeleton className={skeletonStyles.allRoundsLabel} delayMs={ALL_ROUNDS_DELAY_MS} />
      </div>
    </aside>
  )
}
