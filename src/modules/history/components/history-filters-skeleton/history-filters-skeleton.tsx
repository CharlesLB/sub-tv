import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { skeletonSlots } from '../../skeleton-slots/skeleton-slots'
import { historyFiltersSkeletonStyles as styles } from './history-filters-skeleton.styles'

const CATEGORY_CHIP_KEYS = ['all', 'sub13', 'sub14'] as const
const SEASON_CHIP_COUNT = 11
const CHIP_DELAY_STEP_MS = 30

export function HistoryFiltersSkeleton() {
  return (
    <div aria-hidden className={styles.filters}>
      <div className={styles.categoryRow}>
        <Skeleton className={styles.categoryLabel} />
        <span className={styles.categorySpacer} />
        <div className={styles.categoryChips}>
          {CATEGORY_CHIP_KEYS.map((chipKey, index) => (
            <Skeleton key={chipKey} className={styles.categoryChip} delayMs={index * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
      <div className={styles.seasonRow}>
        <Skeleton className={styles.seasonLabel} />
        <div className={styles.seasonChips}>
          {skeletonSlots(SEASON_CHIP_COUNT).map((slot) => (
            <Skeleton key={slot.slotId} className={styles.seasonChip} delayMs={slot.order * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
    </div>
  )
}
