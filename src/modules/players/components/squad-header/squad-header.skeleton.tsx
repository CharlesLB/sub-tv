import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { squadHeaderSkeletonStyles as skeletonStyles } from './squad-header.skeleton.styles'
import { squadHeaderStyles as styles } from './squad-header.styles'

const PART_DELAY_MS = 50

export function SquadHeaderSkeleton() {
  return (
    <div aria-hidden className={styles.header}>
      <Skeleton className={skeletonStyles.crest} />
      <div className={styles.identity}>
        <div className={styles.titleRow}>
          <span className={styles.title}>
            <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.titleWidth)} delayMs={PART_DELAY_MS} />
          </span>
          <Skeleton className={skeletonStyles.categoryTag} delayMs={PART_DELAY_MS * 2} />
        </div>
        <p className={styles.summary}>
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.summaryWidth)} delayMs={PART_DELAY_MS * 3} />
          <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.summaryWrappedLine)} delayMs={PART_DELAY_MS * 3} />
        </p>
      </div>
      <Skeleton className={cn(styles.search, skeletonStyles.search)} delayMs={PART_DELAY_MS * 4} />
    </div>
  )
}
