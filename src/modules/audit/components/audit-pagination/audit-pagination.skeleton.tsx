import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { auditPaginationSkeletonStyles as skeletonStyles } from './audit-pagination.skeleton.styles'
import { auditPaginationStyles as styles } from './audit-pagination.styles'

const PART_DELAY_MS = 40

export function AuditPaginationSkeleton() {
  return (
    <div aria-hidden className={styles.navigation}>
      <Skeleton className={skeletonStyles.previousLink} />
      <span className={styles.currentPage}>
        <Skeleton className={skeletonStyles.textBar} delayMs={PART_DELAY_MS} />
      </span>
      <Skeleton className={skeletonStyles.nextLink} delayMs={PART_DELAY_MS * 2} />
    </div>
  )
}
