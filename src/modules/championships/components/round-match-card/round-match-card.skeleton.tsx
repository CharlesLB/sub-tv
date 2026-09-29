import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { crestStyles } from '@/components/ui/crest/crest.styles'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { roundMatchCardSkeletonStyles as skeletonStyles } from './round-match-card.skeleton.styles'
import { roundMatchCardStyles as styles } from './round-match-card.styles'

const TEAM_LINES = 2
const CARD_DELAY_STEP_MS = 120
const CREST_SIZE = { width: 16, height: 19 } as const

type RoundMatchCardSkeletonProps = { index: number }

export function RoundMatchCardSkeleton({ index }: RoundMatchCardSkeletonProps) {
  const delayMs = index * CARD_DELAY_STEP_MS

  return (
    <div aria-hidden className={cn(styles.card, styles.cardIdle)}>
      <Skeleton className={cn(styles.kicker, skeletonStyles.kicker)} delayMs={delayMs} />
      {skeletonSlots(TEAM_LINES).map(({ slotId }) => (
        <div key={slotId} className={styles.teamLine}>
          <Skeleton className={crestStyles.hexagon} style={CREST_SIZE} delayMs={delayMs} />
          <Skeleton className={cn(styles.teamName, skeletonStyles.teamName)} delayMs={delayMs} />
          <Skeleton className={cn(styles.score, skeletonStyles.score)} delayMs={delayMs} />
        </div>
      ))}
      <div className={cn(styles.action, styles.actionSecondary)}>
        <Skeleton className={skeletonStyles.action} delayMs={delayMs} />
      </div>
    </div>
  )
}
