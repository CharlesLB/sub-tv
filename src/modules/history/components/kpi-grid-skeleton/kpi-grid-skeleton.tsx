import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { kpiGridSkeletonStyles as styles } from './kpi-grid-skeleton.styles'

const CARD_DELAY_STEP_MS = 60

type KpiGridSkeletonProps = { count: number; variant: keyof typeof styles.gridVariant; className?: string }

export function KpiGridSkeleton({ count, variant, className }: KpiGridSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.grid, styles.gridVariant[variant], className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cn(styles.card, styles.cardVariant[variant])}>
          <Skeleton className={cn(styles.value, styles.valueVariant[variant])} delayMs={index * CARD_DELAY_STEP_MS} />
          <Skeleton className={styles.label} delayMs={index * CARD_DELAY_STEP_MS + 40} />
        </div>
      ))}
    </div>
  )
}
