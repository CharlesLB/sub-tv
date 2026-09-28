import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { auditLogSkeletonStyles as styles } from './audit-log-skeleton.styles'

const FILTER_PLACEHOLDER_IDS = ['user', 'action', 'period', 'entity', 'submit'] as const
const ROW_PLACEHOLDER_IDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'] as const
const ROW_DELAY_STEP_MS = 50

export function AuditLogSkeleton() {
  return (
    <div aria-hidden className={styles.container}>
      <div className={styles.filters}>
        {FILTER_PLACEHOLDER_IDS.map((filterId, index) => (
          <div key={filterId} className={styles.filter}>
            <Skeleton className={styles.filterLabelPlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.filterFieldPlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
      <div className={styles.table}>
        {ROW_PLACEHOLDER_IDS.map((rowId, index) => (
          <div key={rowId} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
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
