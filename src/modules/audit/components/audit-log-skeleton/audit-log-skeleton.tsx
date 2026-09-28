import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { auditLogSkeletonStyles as styles } from './audit-log-skeleton.styles'

const FILTER_COUNT = 5
const ROW_COUNT = 10
const ROW_DELAY_STEP_MS = 50

export function AuditLogSkeleton() {
  return (
    <div aria-hidden className={styles.container}>
      <div className={styles.filters}>
        {Array.from({ length: FILTER_COUNT }, (_, index) => (
          <div key={index} className={styles.filter}>
            <Skeleton className={styles.filterLabelPlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.filterFieldPlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
      <div className={styles.table}>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <Skeleton className={styles.timePlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.userPlaceholder} delayMs={index * ROW_DELAY_STEP_MS + 30} />
            <Skeleton className={styles.actionPlaceholder} delayMs={index * ROW_DELAY_STEP_MS + 60} />
            <Skeleton className={styles.entityPlaceholder} delayMs={index * ROW_DELAY_STEP_MS + 90} />
          </div>
        ))}
      </div>
    </div>
  )
}
