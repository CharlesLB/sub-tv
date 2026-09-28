import { Skeleton } from '@/components/ui/skeleton/skeleton'

const CATEGORY_CHIP_KEYS = ['all', 'sub13', 'sub14'] as const
const SEASON_CHIP_COUNT = 11
const CHIP_DELAY_STEP_MS = 30

export function HistoryFiltersSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-[11px]">
      <div className="flex items-center gap-[11px]">
        <Skeleton className="h-[10px] w-[52px] flex-none" />
        <span className="w-[14px] flex-none" />
        <div className="flex gap-[6px]">
          {CATEGORY_CHIP_KEYS.map((chipKey, index) => (
            <Skeleton key={chipKey} className="h-[30px] w-[62px] rounded-card" delayMs={index * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
      <div className="flex items-start gap-[11px]">
        <Skeleton className="mt-2 h-[10px] w-[66px] flex-none" />
        <div className="flex min-w-0 flex-wrap gap-[5px]">
          {Array.from({ length: SEASON_CHIP_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-[27px] w-[52px] rounded-card" delayMs={index * CHIP_DELAY_STEP_MS} />
          ))}
        </div>
      </div>
    </div>
  )
}
