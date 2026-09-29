import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { eventsStripSkeletonStyles as styles } from './events-strip.skeleton.styles'
import { eventsStripStyles } from './events-strip.styles'

const PLACEHOLDER_CHIPS = 3
const CHIP_DELAY_STEP_MS = 80
const TOGGLE_DELAY_MS = 320

export function EventsStripSkeleton() {
  return (
    <div aria-hidden className={eventsStripStyles.strip}>
      <Skeleton className={styles.title} />
      <div className={eventsStripStyles.viewport}>
        <div className={eventsStripStyles.content}>
          {skeletonSlots(PLACEHOLDER_CHIPS).map(({ slotId, order }) => (
            <Skeleton key={slotId} className={styles.chip} delayMs={(order + 1) * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
      <Skeleton className={styles.toggle} delayMs={TOGGLE_DELAY_MS} />
    </div>
  )
}
