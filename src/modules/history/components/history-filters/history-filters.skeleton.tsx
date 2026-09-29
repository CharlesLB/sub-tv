import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { historyFiltersSkeletonStyles as skeletonStyles } from './history-filters.skeleton.styles'
import { historyFiltersStyles as styles } from './history-filters.styles'

const CATEGORY_CHIP_KEYS = ['all', 'sub13', 'sub14'] as const
const SEASON_CHIP_COUNT = 11
const CHIP_DELAY_STEP_MS = 30

export function HistoryFiltersSkeleton() {
  return (
    <div aria-hidden className={styles.filters}>
      <div className={styles.categoryRow}>
        <span className={styles.filterLabel}>
          <Skeleton className={cn(skeletonStyles.label, skeletonStyles.categoryLabelWidth)} />
        </span>
        <div className={styles.categoryChips}>
          {CATEGORY_CHIP_KEYS.map((chipKey, index) => (
            <Skeleton key={chipKey} className={cn(skeletonStyles.categoryChip, skeletonStyles.categoryChipWidth[chipKey])} delayMs={index * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
      <div className={styles.seasonRow}>
        <span className={cn(styles.filterLabel, styles.seasonLabel)}>
          <Skeleton className={cn(skeletonStyles.label, skeletonStyles.seasonLabelWidth)} />
        </span>
        <div className={styles.seasonChips}>
          {skeletonSlots(SEASON_CHIP_COUNT).map((slot) => (
            <Skeleton key={slot.slotId} className={skeletonStyles.seasonChip} delayMs={slot.order * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
    </div>
  )
}
