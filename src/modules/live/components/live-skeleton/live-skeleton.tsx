import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { cn } from '@/lib/utils/cn'
import { BenchSkeleton } from '../bench-skeleton/bench-skeleton'
import { PitchSkeleton } from '../pitch-skeleton/pitch-skeleton'

const FICHA_WIDTHS = [
  { width: 'w-[132px]', delayMs: 0, isFaint: false },
  { width: 'w-[125px]', delayMs: 80, isFaint: false },
  { width: 'w-[146px]', delayMs: 160, isFaint: false },
  { width: 'w-[128px]', delayMs: 240, isFaint: true },
  { width: 'w-[140px]', delayMs: 320, isFaint: true },
  { width: 'w-[126px]', delayMs: 400, isFaint: true },
] as const

const CHIP_DELAYS_MS = [80, 160, 240] as const

export function LiveSkeleton() {
  return (
    <div aria-hidden className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg">
      <div className="flex flex-none items-center justify-center gap-[14px] border-b border-bd bg-pan px-5 py-3">
        <Skeleton className="h-[21px] w-[58px] rounded-card border border-bd bg-pan2" delayMs={140} />
        <div className="flex -skew-x-12 items-stretch">
          <Skeleton className="h-[44px] w-[62px]" />
          <Skeleton className="h-[44px] w-[210px] rounded-card border border-bd bg-pan2" delayMs={180} />
          <Skeleton className="h-[44px] w-[62px]" delayMs={220} />
        </div>
      </div>
      <div className="flex flex-none flex-wrap items-center justify-center gap-x-[15px] gap-y-[3px] border-b border-bd bg-pan px-4 py-[5px] mobile:hidden">
        {FICHA_WIDTHS.map((item) => (
          <span key={item.delayMs} className={cn('flex h-[18px] items-center', item.width)}>
            <Skeleton className={cn('h-[11px] w-full', item.isFaint && 'bg-pan2')} delayMs={item.delayMs} />
          </span>
        ))}
      </div>
      <div className="flex flex-none items-center gap-[10px] overflow-hidden border-b border-bd bg-bg px-[14px] py-2">
        <Skeleton className="h-3 w-[68px] flex-none" />
        {CHIP_DELAYS_MS.map((delayMs) => (
          <Skeleton key={delayMs} className="h-[30px] w-[150px] flex-none bg-pan2" delayMs={delayMs} />
        ))}
        <Skeleton className="ml-auto h-[30px] w-[104px] flex-none rounded-card border border-bd bg-pan2" delayMs={320} />
      </div>
      <div className="grid min-h-[150px] flex-[1_1_0] grid-cols-[120px_minmax(0,1fr)_120px] grid-rows-[minmax(0,1fr)] items-stretch gap-px overflow-hidden bg-bg compact:grid-cols-[64px_minmax(0,1fr)_64px] mobile:grid-cols-[66px_minmax(0,1fr)_66px]">
        <BenchSkeleton delayOffsetMs={0} />
        <PitchSkeleton />
        <BenchSkeleton delayOffsetMs={50} />
      </div>
    </div>
  )
}
