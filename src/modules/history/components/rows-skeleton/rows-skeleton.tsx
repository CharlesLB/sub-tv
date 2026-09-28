import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { rowsSkeletonStyles as styles } from './rows-skeleton.styles'

const ROW_DELAY_STEP_MS = 60

type RowsSkeletonProps = { rowCount: number; titleWidthClass: string; className?: string }

export function RowsSkeleton({ rowCount, titleWidthClass, className }: RowsSkeletonProps) {
  return (
    <div aria-hidden className={cn(styles.section, className)}>
      <Skeleton className={cn(styles.title, titleWidthClass)} />
      <div className={styles.rows}>
        {Array.from({ length: rowCount }, (_, index) => (
          <div key={index} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <Skeleton className={styles.position} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.colorSwatch} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.name} delayMs={index * ROW_DELAY_STEP_MS + 30} />
            <Skeleton className={styles.value} delayMs={index * ROW_DELAY_STEP_MS + 60} />
          </div>
        ))}
      </div>
    </div>
  )
}
