import { Skeleton } from '@/components/ui/skeleton/skeleton'

const ROW_KEYS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'] as const
const ROW_DELAY_STEP_MS = 60

export function ChampionshipDetailSkeleton() {
  return (
    <div aria-hidden className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 border-b border-bd bg-pan px-5 pt-[14px] pb-3">
        <Skeleton className="h-[30px] w-[150px]" />
        <Skeleton className="h-[30px] w-[90px]" delayMs={80} />
        <Skeleton className="h-[30px] w-[70px]" delayMs={160} />
      </div>
      <div className="flex flex-wrap items-start gap-[18px] overflow-hidden p-5">
        <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[10px]">
          <Skeleton className="h-4 w-[260px]" />
          <div className="overflow-hidden rounded-card border border-bd bg-pan">
            <Skeleton className="h-[34px] rounded-none bg-pan2" />
            {ROW_KEYS.map((rowKey, index) => (
              <div key={rowKey} className="flex h-11 items-center gap-3 border-b border-pan2 px-[14px]">
                <Skeleton className="h-3 w-4" delayMs={index * ROW_DELAY_STEP_MS} />
                <Skeleton className="h-[13px] w-[11px]" delayMs={index * ROW_DELAY_STEP_MS} />
                <Skeleton className="h-3 w-[40%]" delayMs={index * ROW_DELAY_STEP_MS + 40} />
                <Skeleton className="ml-auto h-4 w-6" delayMs={index * ROW_DELAY_STEP_MS + 80} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-[280px] flex-[0_1_340px] flex-col gap-[10px]">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-[88px] bg-pan2" delayMs={100} />
          <Skeleton className="h-[88px] bg-pan2" delayMs={200} />
          <Skeleton className="h-[88px] bg-pan2" delayMs={300} />
        </div>
      </div>
    </div>
  )
}
