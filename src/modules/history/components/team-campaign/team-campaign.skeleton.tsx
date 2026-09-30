import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { staggeredRowOf } from '../../lib/staggered-row/staggered-row'
import { HistorySectionSkeleton } from '../history-section/history-section.skeleton'
import { RowChevron } from '../row-chevron/row-chevron'
import { SkeletonCell } from '../skeleton-cell/skeleton-cell'
import { teamCampaignSkeletonStyles as skeletonStyles } from './team-campaign.skeleton.styles'
import { teamCampaignStyles as styles } from './team-campaign.styles'

const ROW_COUNT = 8
const ROW_DELAY_STEP_MS = 35
const CELL_DELAY_STEP_MS = 30

export function TeamCampaignSkeleton() {
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
              <Skeleton className={skeletonStyles.formSquares} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={styles.record} barClassName={skeletonStyles.record} delayMs={numbersDelayMs} />
              <SkeletonCell cellClassName={styles.points} barClassName={skeletonStyles.points} delayMs={numbersDelayMs} />
              <RowChevron />
            </div>
          )
        })}
      </div>
    </HistorySectionSkeleton>
  )
}
