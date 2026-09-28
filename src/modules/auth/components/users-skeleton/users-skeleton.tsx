import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { cn } from '@/lib/utils/cn'

const ROW_COUNT = 4
const ROW_DELAY_STEP_MS = 60

export function UsersSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-[22px]">
      <Skeleton className="h-[112px] rounded-card border border-bd bg-pan" />
      <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className={cn('flex h-[52px] items-center gap-3 px-3', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}>
            <Skeleton className="h-3 w-[160px]" delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className="ml-auto h-8 w-[200px] rounded-card" delayMs={index * ROW_DELAY_STEP_MS + 40} />
          </div>
        ))}
      </div>
    </div>
  )
}
