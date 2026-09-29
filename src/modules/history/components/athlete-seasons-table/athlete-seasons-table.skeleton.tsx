import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { HistorySectionSkeleton } from '../history-section/history-section.skeleton'
import { RowChevron } from '../row-chevron/row-chevron'
import { SkeletonCell } from '../skeleton-cell/skeleton-cell'
import { athleteSeasonsTableSkeletonStyles as skeletonStyles } from './athlete-seasons-table.skeleton.styles'
import { athleteSeasonsTableStyles as styles } from './athlete-seasons-table.styles'

const ROW_COUNT = 2
const ROW_DELAY_STEP_MS = 35
const CELL_DELAY_STEP_MS = 30

export function AthleteSeasonsTableSkeleton() {
  return (
    <HistorySectionSkeleton titleWidthClass={skeletonStyles.titleWidth}>
      <div className={styles.table}>
        {skeletonSlots(ROW_COUNT).map((slot) => {
          const stagger = staggeredRowOf(slot.order, ROW_DELAY_STEP_MS)
          const delayMs = slot.order * ROW_DELAY_STEP_MS
          const numbersDelayMs = delayMs + CELL_DELAY_STEP_MS

          return (
            <div key={slot.slotId} className={cn(styles.row, stagger.className)} style={stagger.style}>
              <SkeletonCell cellClassName={styles.year} barClassName={skeletonStyles.year} delayMs={delayMs} />
              <SkeletonCell cellClassName={styles.championships} barClassName={skeletonStyles.championships} delayMs={delayMs} />
              <SkeletonCell cellClassName={styles.games} barClassName={skeletonStyles.games} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={styles.average} barClassName={skeletonStyles.average} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={styles.goals} barClassName={skeletonStyles.goals} delayMs={numbersDelayMs} />
              <RowChevron />
            </div>
          )
        })}
      </div>
    </HistorySectionSkeleton>
  )
}
