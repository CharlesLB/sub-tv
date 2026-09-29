import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { HistorySectionSkeleton } from '../history-section/history-section.skeleton'
import { RowChevron } from '../row-chevron/row-chevron'
import { SkeletonCell } from '../skeleton-cell/skeleton-cell'
import { accumulatedTableSkeletonStyles as skeletonStyles } from './accumulated-table.skeleton.styles'
import { accumulatedTableStyles as styles } from './accumulated-table.styles'

const ROW_COUNT = 8
const ROW_DELAY_STEP_MS = 30
const CELL_DELAY_STEP_MS = 30

const RESULT_COLUMN_KEYS = ['wins', 'draws', 'losses'] as const

export function AccumulatedTableSkeleton() {
  return (
    <HistorySectionSkeleton titleWidthClass={skeletonStyles.titleWidth} className={styles.section}>
      <div className={styles.table}>
        <div className={styles.header}>
          <Skeleton className={skeletonStyles.header} />
        </div>
        {skeletonSlots(ROW_COUNT).map((slot) => {
          const stagger = staggeredRowOf(slot.order, ROW_DELAY_STEP_MS)
          const delayMs = slot.order * ROW_DELAY_STEP_MS
          const nameDelayMs = delayMs + CELL_DELAY_STEP_MS
          const numbersDelayMs = nameDelayMs + CELL_DELAY_STEP_MS

          return (
            <div key={slot.slotId} className={cn(styles.row, stagger.className, slot.order === 0 ? styles.rowLeader : styles.rowFollower)} style={stagger.style}>
              <SkeletonCell cellClassName={styles.position} barClassName={skeletonStyles.position} delayMs={delayMs} />
              <Skeleton className={styles.crestPlaceholder} delayMs={delayMs} />
              <SkeletonCell cellClassName={styles.teamName} barClassName={skeletonStyles.teamName} delayMs={nameDelayMs} />
              <SkeletonCell cellClassName={styles.category} barClassName={skeletonStyles.category} delayMs={nameDelayMs} />
              <SkeletonCell cellClassName={cn(styles.numberCell, styles.playedColumn)} barClassName={skeletonStyles.number} delayMs={numbersDelayMs} />
              {RESULT_COLUMN_KEYS.map((columnKey) => (
                <SkeletonCell key={columnKey} cellClassName={cn(styles.numberCell, styles.resultColumn)} barClassName={skeletonStyles.number} delayMs={numbersDelayMs} />
              ))}
              <SkeletonCell cellClassName={cn(styles.numberCell, styles.goalDifferenceColumn)} barClassName={skeletonStyles.goalDifference} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={cn(styles.numberCell, styles.pointsCell)} barClassName={skeletonStyles.points} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={cn(styles.numberCell, styles.winRateCell)} barClassName={skeletonStyles.winRate} delayMs={numbersDelayMs} />
              <RowChevron />
            </div>
          )
        })}
      </div>
    </HistorySectionSkeleton>
  )
}
