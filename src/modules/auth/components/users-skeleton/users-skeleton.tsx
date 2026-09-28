import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { usersSkeletonStyles as styles } from './users-skeleton.styles'

const ROW_PLACEHOLDER_IDS = ['first', 'second', 'third', 'fourth'] as const
const ROW_DELAY_STEP_MS = 60

export function UsersSkeleton() {
  return (
    <div aria-hidden className={styles.container}>
      <Skeleton className={styles.formPlaceholder} />
      <div className={styles.table}>
        {ROW_PLACEHOLDER_IDS.map((rowId, index) => (
          <div key={rowId} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <Skeleton className={styles.namePlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.actionsPlaceholder} delayMs={index * ROW_DELAY_STEP_MS + 40} />
          </div>
        ))}
      </div>
    </div>
  )
}
