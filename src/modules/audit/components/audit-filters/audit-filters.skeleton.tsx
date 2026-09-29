import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { auditFiltersSkeletonStyles as skeletonStyles } from './audit-filters.skeleton.styles'
import { auditFiltersStyles as styles } from './audit-filters.styles'

const FILTER_DELAY_MS = 50

const labelWidthOf = (order: number): string => skeletonStyles.labelWidths[order] ?? skeletonStyles.labelWidths[0]

export function AuditFiltersSkeleton() {
  const filterSlots = skeletonSlots(skeletonStyles.labelWidths.length)
  const actionsDelay = filterSlots.length * FILTER_DELAY_MS

  return (
    <div aria-hidden className={styles.form}>
      {filterSlots.map(({ slotId, order }) => (
        <div key={slotId} className={styles.label}>
          <span>
            <Skeleton className={cn(skeletonStyles.textBar, labelWidthOf(order))} delayMs={order * FILTER_DELAY_MS} />
          </span>
          <Skeleton className={skeletonStyles.field} delayMs={order * FILTER_DELAY_MS} />
        </div>
      ))}
      <div className={styles.actions}>
        <Skeleton className={skeletonStyles.submitButton} delayMs={actionsDelay} />
        <Skeleton className={skeletonStyles.clearLink} delayMs={actionsDelay} />
      </div>
    </div>
  )
}
