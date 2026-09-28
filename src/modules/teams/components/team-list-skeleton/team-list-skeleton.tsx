import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { cn } from '@/lib/utils/cn'

const ROWS = [
  { key: 'first', nameWidth: '82%', isActive: true, isFaded: false },
  { key: 'second', nameWidth: '70%', isActive: false, isFaded: false },
  { key: 'third', nameWidth: '88%', isActive: false, isFaded: false },
  { key: 'fourth', nameWidth: '64%', isActive: false, isFaded: true },
] as const
const ROW_DELAY_MS = 100

export function TeamListSkeleton() {
  return (
    <div aria-hidden className="max-w-[250px] min-w-[190px] flex-[1_1_210px] bg-pan py-[14px]">
      <div className="px-4 pb-2">
        <Skeleton className="h-[11px] w-[118px]" />
      </div>
      <div className="flex flex-wrap gap-[6px] px-4 pb-3">
        <Skeleton className="h-[30px] w-[58px]" />
        <Skeleton className="h-[30px] w-[54px] bg-pan2" delayMs={100} />
        <Skeleton className="h-[30px] w-[54px] bg-pan2" delayMs={200} />
      </div>
      <div className="border-t border-bd px-4 pt-3 pb-2">
        <Skeleton className="h-[11px] w-[46px]" delayMs={100} />
      </div>
      {ROWS.map((row, index) => {
        const delay = index * ROW_DELAY_MS
        const fillClass = row.isFaded ? 'bg-pan2' : 'bg-bd'

        return (
          <div key={row.key} className={cn('flex items-center gap-[10px] border-l-[3px] px-4 py-[10px]', row.isActive ? 'border-bd2 bg-pan2' : 'border-transparent')}>
            <Skeleton className={cn('hexagon h-6 w-5 flex-none', fillClass)} delayMs={delay} />
            <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <Skeleton className={cn('h-3', fillClass)} delayMs={delay + 50} style={{ width: row.nameWidth }} />
              <Skeleton className={cn('h-[14px] w-[46px]', fillClass)} delayMs={delay + 100} />
            </span>
          </div>
        )
      })}
    </div>
  )
}
