import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

const ROW_DELAY_STEP_MS = 60

type RowsSkeletonProps = { rowCount: number; titleWidthClass: string; className?: string }

export function RowsSkeleton({ rowCount, titleWidthClass, className }: RowsSkeletonProps) {
  return (
    <div aria-hidden className={cn('flex min-w-0 flex-col gap-[10px]', className)}>
      <Skeleton className={cn('h-[15px]', titleWidthClass)} />
      <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan">
        {Array.from({ length: rowCount }, (_, index) => (
          <div key={index} className={cn('flex h-[41px] items-center gap-[10px] px-3', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}>
            <Skeleton className="h-[10px] w-5 flex-none" delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className="size-[9px] flex-none" delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className="h-3 w-[38%]" delayMs={index * ROW_DELAY_STEP_MS + 30} />
            <Skeleton className="ml-auto h-3 w-[22%]" delayMs={index * ROW_DELAY_STEP_MS + 60} />
          </div>
        ))}
      </div>
    </div>
  )
}
