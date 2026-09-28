import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

const FILTER_COUNT = 5
const ROW_COUNT = 10
const ROW_DELAY_STEP_MS = 50

export function AuditLogSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-[10px] rounded-card border border-bd bg-pan p-[14px]">
        {Array.from({ length: FILTER_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-[5px]">
            <Skeleton className="h-[10px] w-[56px]" delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className="h-[34px] rounded-card" delayMs={index * ROW_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
      <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className={cn('flex h-[46px] items-center gap-3 px-3', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}>
            <Skeleton className="h-[10px] w-[100px] flex-none" delayMs={index * ROW_DELAY_STEP_MS} />
            <Skeleton className="h-3 w-[110px] flex-none" delayMs={index * ROW_DELAY_STEP_MS + 30} />
            <Skeleton className="h-3 w-[150px] flex-none mobile:hidden" delayMs={index * ROW_DELAY_STEP_MS + 60} />
            <Skeleton className="h-3 w-[30%] mobile:hidden" delayMs={index * ROW_DELAY_STEP_MS + 90} />
          </div>
        ))}
      </div>
    </div>
  )
}
