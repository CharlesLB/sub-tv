import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { highlightCardsSkeletonStyles as skeletonStyles } from './highlight-cards.skeleton.styles'
import { highlightCardsStyles as styles } from './highlight-cards.styles'

const HIGHLIGHT_COUNT = 3
const CARD_DELAY_STEP_MS = 60
const LINE_DELAY_STEP_MS = 40

export function HighlightCardsSkeleton() {
  return (
    <div aria-hidden className={styles.grid}>
      {skeletonSlots(HIGHLIGHT_COUNT).map((slot) => (
        <div key={slot.slotId} className={styles.card}>
          <Skeleton className={cn(styles.label, skeletonStyles.label)} delayMs={slot.order * CARD_DELAY_STEP_MS} />
          <Skeleton className={cn(styles.value, skeletonStyles.value)} delayMs={slot.order * CARD_DELAY_STEP_MS + LINE_DELAY_STEP_MS} />
          <Skeleton className={cn(styles.name, skeletonStyles.name)} delayMs={slot.order * CARD_DELAY_STEP_MS + 2 * LINE_DELAY_STEP_MS} />
        </div>
      ))}
    </div>
  )
}
