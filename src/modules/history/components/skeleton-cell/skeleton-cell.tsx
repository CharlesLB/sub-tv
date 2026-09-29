import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { skeletonCellStyles as styles } from './skeleton-cell.styles'

type SkeletonCellProps = { cellClassName: string; barClassName: string; delayMs: number }

export function SkeletonCell({ cellClassName, barClassName, delayMs }: SkeletonCellProps) {
  return (
    <span className={cellClassName}>
      <Skeleton className={cn(styles.bar, barClassName)} delayMs={delayMs} />
    </span>
  )
}
