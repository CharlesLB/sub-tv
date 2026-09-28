import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { skeletonSlots } from '../../skeleton-slots/skeleton-slots'
import { rowsSkeletonStyles as styles } from './rows-skeleton.styles'

const ROW_DELAY_STEP_MS = 60

type RowsSkeletonProps = { rowCount: number; titleWidthClass: string; className?: string }

export function RowsSkeleton({ rowCount, titleWidthClass, className }: RowsSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.section, className)}>
      <Skeleton className={cn(styles.title, titleWidthClass)} />
      <div className={styles.rows}>
        {skeletonSlots(rowCount).map((slot) => (
          <div key={slot.slotId} className={cn(styles.row, slot.order % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <Skeleton className={styles.position} delayMs={slot.order * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.colorSwatch} delayMs={slot.order * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.name} delayMs={slot.order * ROW_DELAY_STEP_MS + 30} />
            <Skeleton className={styles.value} delayMs={slot.order * ROW_DELAY_STEP_MS + 60} />
          </div>
        ))}
      </div>
    </div>
  )
}
