import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

const DOT_DELAYS_MS = [100, 180, 260, 340] as const
const FAINT_FROM_INDEX = 2

type BenchSkeletonProps = { delayOffsetMs: number }

export function BenchSkeleton({ delayOffsetMs }: BenchSkeletonProps) {
  return (
    <div className="flex flex-col gap-[10px] overflow-hidden bg-pan px-[10px] pt-[10px] pb-3">
      <div className="flex flex-col gap-[5px]">
        <Skeleton className="h-[10px] w-[52px] max-w-full" delayMs={delayOffsetMs} />
        <Skeleton className="h-[13px] w-[92px] max-w-full" delayMs={delayOffsetMs + 60} />
      </div>
      {DOT_DELAYS_MS.map((delayMs, index) => (
        <div key={delayMs} className="flex flex-col items-center gap-1">
          <Skeleton className={cn('size-[30px] rounded-full', index >= FAINT_FROM_INDEX && 'bg-pan2')} delayMs={delayOffsetMs + delayMs} />
          <Skeleton className={cn('h-[9px] w-[54px] max-w-full', index >= FAINT_FROM_INDEX && 'bg-pan2')} delayMs={delayOffsetMs + delayMs + 40} />
        </div>
      ))}
    </div>
  )
}
