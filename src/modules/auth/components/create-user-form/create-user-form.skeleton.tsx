import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { createUserFormSkeletonStyles as skeletonStyles } from './create-user-form.skeleton.styles'
import { createUserFormStyles as styles } from './create-user-form.styles'

const FIELD_DELAY_MS = 60

const labelWidthOf = (order: number): string => skeletonStyles.labelWidths[order] ?? skeletonStyles.labelWidths[0]

export function CreateUserFormSkeleton() {
  const fieldSlots = skeletonSlots(skeletonStyles.labelWidths.length)

  return (
    <div aria-hidden className={styles.form}>
      <span className={styles.title}>
        <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.titleWidth)} />
      </span>
      <div className={styles.fields}>
        {fieldSlots.map(({ slotId, order }) => (
          <div key={slotId} className={styles.label}>
            <span>
              <Skeleton className={cn(skeletonStyles.textBar, labelWidthOf(order))} delayMs={(order + 1) * FIELD_DELAY_MS} />
            </span>
            <Skeleton className={skeletonStyles.field} delayMs={(order + 1) * FIELD_DELAY_MS} />
          </div>
        ))}
        <Skeleton className={skeletonStyles.submitButton} delayMs={(fieldSlots.length + 1) * FIELD_DELAY_MS} />
      </div>
    </div>
  )
}
