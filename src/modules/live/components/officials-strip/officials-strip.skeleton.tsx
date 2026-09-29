import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { officialsStripSkeletonStyles as styles } from './officials-strip.skeleton.styles'
import { officialsStripStyles } from './officials-strip.styles'

const ITEM_DELAY_STEP_MS = 80
const VALUE_DELAY_MS = 40

const PLACEHOLDER_ITEMS = Object.entries(styles.width).map(([key, width], order) => ({ key, width, delayMs: order * ITEM_DELAY_STEP_MS }))

export function OfficialsStripSkeleton() {
  return (
    <div aria-hidden className={officialsStripStyles.strip}>
      {PLACEHOLDER_ITEMS.map((item) => (
        <div key={item.key} className={officialsStripStyles.item}>
          <Skeleton className={styles.icon} delayMs={item.delayMs} />
          <Skeleton className={cn(styles.label, item.width.label)} delayMs={item.delayMs} />
          <Skeleton className={cn(styles.value, item.width.value)} delayMs={item.delayMs + VALUE_DELAY_MS} />
        </div>
      ))}
    </div>
  )
}
