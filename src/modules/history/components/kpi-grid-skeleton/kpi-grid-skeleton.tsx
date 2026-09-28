import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { skeletonSlots } from '../../skeleton-slots/skeleton-slots'
import { kpiGridSkeletonStyles as styles } from './kpi-grid-skeleton.styles'

const CARD_DELAY_STEP_MS = 60

type KpiGridSkeletonProps = { count: number; variant: keyof typeof styles.gridVariant; className?: string }

export function KpiGridSkeleton({ count, variant, className }: KpiGridSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.grid, styles.gridVariant[variant], className)}>
      {skeletonSlots(count).map((slot) => (
        <div key={slot.slotId} className={cn(styles.card, styles.cardVariant[variant])}>
          <Skeleton className={cn(styles.value, styles.valueVariant[variant])} delayMs={slot.order * CARD_DELAY_STEP_MS} />
          <Skeleton className={styles.label} delayMs={slot.order * CARD_DELAY_STEP_MS + 40} />
        </div>
      ))}
    </div>
  )
}
