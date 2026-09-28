import { Skeleton } from '@/components/ui/skeleton/skeleton'

export function SeasonRailSkeleton() {
  return (
    <div aria-hidden className="flex h-[52px] flex-none items-center gap-3 border-b border-bd bg-pan0 px-[14px] mobile:h-[46px] mobile:px-2">
      <Skeleton className="size-[30px] rounded-card" />
      <Skeleton className="h-4 w-[260px] max-w-[40%]" delayMs={80} />
      <span className="mx-[6px] my-[7px] w-px self-stretch bg-bd" />
      <Skeleton className="h-[30px] w-[180px] rounded-card" delayMs={160} />
      <Skeleton className="h-[30px] w-[180px] rounded-card" delayMs={240} />
    </div>
  )
}
