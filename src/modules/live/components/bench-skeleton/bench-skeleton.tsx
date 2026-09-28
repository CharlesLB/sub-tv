import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { benchSkeletonStyles as styles } from './bench-skeleton.styles'

const DOT_DELAYS_MS = [100, 180, 260, 340] as const
const FAINT_FROM_INDEX = 2

type BenchSkeletonProps = { delayOffsetMs: number }

export function BenchSkeleton({ delayOffsetMs }: BenchSkeletonProps) {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <Skeleton className={styles.headerTitle} delayMs={delayOffsetMs} />
        <Skeleton className={styles.headerTeam} delayMs={delayOffsetMs + 60} />
      </div>
      {DOT_DELAYS_MS.map((delayMs, index) => (
        <div key={delayMs} className={styles.reserve}>
          <Skeleton className={cn(styles.reserveDot, index >= FAINT_FROM_INDEX && styles.faintReserve)} delayMs={delayOffsetMs + delayMs} />
          <Skeleton className={cn(styles.reserveName, index >= FAINT_FROM_INDEX && styles.faintReserve)} delayMs={delayOffsetMs + delayMs + 40} />
        </div>
      ))}
    </div>
  )
}
