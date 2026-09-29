import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { championshipCardSkeletonStyles as skeletonStyles } from './championship-card.skeleton.styles'
import { championshipCardStyles as styles } from './championship-card.styles'

const PODIUM_ROWS = 3
const CARD_DELAY_STEP_MS = 120
const PLACEHOLDER_DELAY_STEP_MS = 40

type ChampionshipCardSkeletonProps = { index: number }

export function ChampionshipCardSkeleton({ index }: ChampionshipCardSkeletonProps) {
  const delayOf = (order: number): number => index * CARD_DELAY_STEP_MS + order * PLACEHOLDER_DELAY_STEP_MS

  return (
    <div aria-hidden className={cn(styles.card, styles.cardIdle, skeletonStyles.card)}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <Skeleton className={cn(styles.name, skeletonStyles.name)} delayMs={delayOf(0)} />
          <Skeleton className={cn(styles.statusLine, skeletonStyles.statusLine)} delayMs={delayOf(1)} />
        </div>
        <Skeleton className={cn(styles.categoryTag, skeletonStyles.categoryTag)} delayMs={delayOf(1)} />
      </div>
      <div className={styles.podium}>
        {skeletonSlots(PODIUM_ROWS).map(({ slotId, order }) => (
          <div key={slotId} className={styles.podiumRow}>
            <Skeleton className={cn(styles.podiumPosition, skeletonStyles.podiumPosition)} delayMs={delayOf(order + 2)} />
            <Skeleton className={styles.emptyPodiumCrest} delayMs={delayOf(order + 2)} />
            <Skeleton className={cn(styles.podiumTeam, skeletonStyles.podiumTeam)} delayMs={delayOf(order + 2)} />
            <Skeleton className={cn(styles.podiumPoints, skeletonStyles.podiumPoints)} delayMs={delayOf(order + 2)} />
          </div>
        ))}
      </div>
      <div className={cn(styles.status, styles.statusIdle)}>
        <Skeleton className={skeletonStyles.scheduleIcon} delayMs={delayOf(5)} />
        <Skeleton className={cn(styles.statusText, skeletonStyles.statusText)} delayMs={delayOf(5)} />
        <Skeleton className={cn(styles.statusMeta, skeletonStyles.statusMeta)} delayMs={delayOf(5)} />
      </div>
      <div className={styles.openLabel}>
        <Skeleton className={skeletonStyles.openLabel} delayMs={delayOf(6)} />
      </div>
    </div>
  )
}
