import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { SIDE, type Side } from '@/modules/matches/client'
import { benchDotStyles } from '../bench-dot/bench-dot.styles'
import { benchColumnSkeletonStyles as styles } from './bench-column.skeleton.styles'
import { benchColumnStyles } from './bench-column.styles'

const PLACEHOLDER_RESERVES = 5
const FAINT_FROM_ORDER = 3
const RESERVE_DELAY_STEP_MS = 80
const FIRST_RESERVE_DELAY_MS = 100
const HEADER_LINE_DELAY_MS = 60
const NAME_DELAY_MS = 40
const DELAY_OFFSET_MS: Record<Side, number> = { [SIDE.HOME]: 0, [SIDE.AWAY]: 50 }

type BenchColumnSkeletonProps = { side: Side }

export function BenchColumnSkeleton({ side }: BenchColumnSkeletonProps) {
  const delayOffsetMs = DELAY_OFFSET_MS[side]

  return (
    <div aria-hidden className={cn(benchColumnStyles.column, side === SIDE.HOME ? benchColumnStyles.columnHome : benchColumnStyles.columnAway, styles.columnBorder)}>
      <div className={benchColumnStyles.header}>
        <Skeleton className={styles.title} delayMs={delayOffsetMs} />
        <div className={styles.teamLines}>
          <Skeleton className={cn(styles.teamLine, styles.teamLineWidth.first)} delayMs={delayOffsetMs + HEADER_LINE_DELAY_MS} />
          <Skeleton className={cn(styles.teamLine, styles.teamLineWidth.second)} delayMs={delayOffsetMs + HEADER_LINE_DELAY_MS} />
        </div>
      </div>
      {skeletonSlots(PLACEHOLDER_RESERVES).map(({ slotId, order }) => {
        const delayMs = delayOffsetMs + FIRST_RESERVE_DELAY_MS + order * RESERVE_DELAY_STEP_MS
        const isFaint = order >= FAINT_FROM_ORDER

        return (
          <div key={slotId} className={benchDotStyles.button}>
            <Skeleton className={cn(styles.reserveBadge, isFaint && styles.faint)} delayMs={delayMs} />
            <Skeleton className={cn(styles.reserveName, isFaint && styles.faint)} delayMs={delayMs + NAME_DELAY_MS} />
          </div>
        )
      })}
    </div>
  )
}
