import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { HistorySectionSkeleton } from '../history-section/history-section.skeleton'
import { competitionPresenceListSkeletonStyles as skeletonStyles } from './competition-presence-list.skeleton.styles'
import { competitionPresenceListStyles as styles } from './competition-presence-list.styles'

const PRESENCE_COUNT = 2
const ITEM_DELAY_STEP_MS = 40

export function CompetitionPresenceListSkeleton() {
  return (
    <HistorySectionSkeleton titleWidthClass={skeletonStyles.titleWidth}>
      <div className={styles.list}>
        {skeletonSlots(PRESENCE_COUNT).map((slot) => (
          <div key={slot.slotId} className={styles.item}>
            <Skeleton className={cn(styles.name, skeletonStyles.name)} delayMs={slot.order * ITEM_DELAY_STEP_MS} />
            <Skeleton className={cn(styles.seasonCount, skeletonStyles.seasonCount)} delayMs={slot.order * ITEM_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
    </HistorySectionSkeleton>
  )
}
