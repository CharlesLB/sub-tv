import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { staggeredRowOf } from '../../staggered-row/staggered-row'
import { HistorySectionSkeleton } from '../history-section/history-section.skeleton'
import { SkeletonCell } from '../skeleton-cell/skeleton-cell'
import { teamScorersSkeletonStyles as skeletonStyles } from './team-scorers.skeleton.styles'
import { teamScorersStyles as styles } from './team-scorers.styles'

const ROW_COUNT = 6
const ROW_DELAY_STEP_MS = 40
const CELL_DELAY_STEP_MS = 30

export function TeamScorersSkeleton() {
  return (
    <HistorySectionSkeleton titleWidthClass={skeletonStyles.titleWidth}>
      <div className={styles.list}>
        {skeletonSlots(ROW_COUNT).map((slot) => {
          const stagger = staggeredRowOf(slot.order, ROW_DELAY_STEP_MS)
          const delayMs = slot.order * ROW_DELAY_STEP_MS
          const numbersDelayMs = delayMs + CELL_DELAY_STEP_MS

          return (
            <div key={slot.slotId} className={cn(styles.row, stagger.className)} style={stagger.style}>
              <SkeletonCell cellClassName={styles.position} barClassName={skeletonStyles.position} delayMs={delayMs} />
              <SkeletonCell cellClassName={styles.name} barClassName={skeletonStyles.name} delayMs={delayMs} />
              <SkeletonCell cellClassName={styles.games} barClassName={skeletonStyles.games} delayMs={numbersDelayMs} />
              <Skeleton className={styles.barTrack} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={styles.goals} barClassName={skeletonStyles.goals} delayMs={numbersDelayMs} />
            </div>
          )
        })}
      </div>
    </HistorySectionSkeleton>
  )
}
