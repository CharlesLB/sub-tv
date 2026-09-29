import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { kpiCardStyles } from '../kpi-card/kpi-card.styles'
import { kpiGridSkeletonStyles as skeletonStyles } from './kpi-grid.skeleton.styles'
import { kpiGridStyles as styles } from './kpi-grid.styles'

const KPI_COUNT = 4
const CARD_DELAY_STEP_MS = 60
const LABEL_DELAY_MS = 40

type KpiGridSkeletonProps = { variant: keyof typeof styles.gridVariant }

export function KpiGridSkeleton({ variant }: KpiGridSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.grid, styles.gridVariant[variant])}>
      {skeletonSlots(KPI_COUNT).map((slot) => (
        <div key={slot.slotId} className={cn(kpiCardStyles.card, kpiCardStyles.cardVariant[variant])}>
          <Skeleton className={cn(kpiCardStyles.valueVariant[variant], skeletonStyles.value)} delayMs={slot.order * CARD_DELAY_STEP_MS} />
          <Skeleton className={cn(kpiCardStyles.label, skeletonStyles.label)} delayMs={slot.order * CARD_DELAY_STEP_MS + LABEL_DELAY_MS} />
        </div>
      ))}
    </div>
  )
}
