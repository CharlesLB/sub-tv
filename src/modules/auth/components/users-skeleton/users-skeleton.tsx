import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { usersSkeletonStyles as styles } from './users-skeleton.styles'

const ROW_COUNT = 4
const ROW_DELAY_STEP_MS = 60

export function UsersSkeleton() {
  return (
    <div aria-hidden className={styles.container}>
      <Skeleton className={styles.formPlaceholder} />
      <div className={styles.table}>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <Skeleton className={styles.namePlaceholder} delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className={styles.actionsPlaceholder} delayMs={index * ROW_DELAY_STEP_MS + 40} />
          </div>
        ))}
      </div>
    </div>
  )
}
