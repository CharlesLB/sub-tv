import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { cn } from '@/lib/utils/cn'
import { ROSTER_GRID_CLASS } from '../roster-grid/roster-grid'

const ROW_NAME_WIDTHS = ['64%', '52%', '72%', '58%', '66%', '48%'] as const
const HEADER_CELL_KEYS = ['number', 'name', 'position', 'games', 'goals', 'curiosities'] as const
const ROW_DELAY_MS = 80
const CELL_DELAY_MS = 50
const FADED_ROW_START = 4
const NAME_COLUMN_INDEX = 1
const LAST_COLUMN_INDEX = HEADER_CELL_KEYS.length - 1

export function SquadWorkspaceSkeleton() {
  return (
    <>
      <div aria-hidden className="@container flex min-h-[300px] min-w-0 flex-[4_1_300px] flex-col bg-pan2">
        <div className="flex flex-wrap items-center gap-3 border-b border-bd px-4 py-3">
          <Skeleton className="hexagon h-[27px] w-[22px] flex-none" />
          <span className="flex min-w-0 flex-col gap-[6px]">
            <Skeleton className="h-[17px] w-[150px]" delayMs={50} />
            <Skeleton className="h-[11px] w-[190px] max-w-full" delayMs={100} />
          </span>
          <Skeleton className="h-[38px] min-w-[120px] flex-1 bg-pan" delayMs={150} />
          <Skeleton className="h-[38px] w-[140px] max-w-full flex-[0_1_auto] bg-pan" delayMs={200} />
        </div>
        <div className={cn(ROSTER_GRID_CLASS, 'border-b border-bd py-2')}>
          {HEADER_CELL_KEYS.map((cellKey, index) => (
            <Skeleton key={cellKey} className={cn('h-[10px]', index === NAME_COLUMN_INDEX ? 'w-[52px]' : null)} delayMs={index * CELL_DELAY_MS} />
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {ROW_NAME_WIDTHS.map((nameWidth, rowIndex) => {
            const delay = rowIndex * ROW_DELAY_MS
            const fillClass = rowIndex >= FADED_ROW_START ? 'bg-pan2' : 'bg-bd'

            return (
              <div key={`${nameWidth}-${rowIndex}`} className={cn(ROSTER_GRID_CLASS, 'h-11 items-center border-b border-bd')}>
                {HEADER_CELL_KEYS.map((cellKey, cellIndex) => (
                  <Skeleton
                    key={cellKey}
                    className={cn(cellIndex === 0 ? 'h-[15px]' : cellIndex === NAME_COLUMN_INDEX ? 'h-[13px]' : 'h-[11px]', cellIndex === LAST_COLUMN_INDEX ? 'w-4' : null, fillClass)}
                    delayMs={delay + cellIndex * CELL_DELAY_MS}
                    style={cellIndex === NAME_COLUMN_INDEX ? { width: nameWidth } : {}}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
      <div aria-hidden className="flex max-w-[420px] min-h-[260px] min-w-0 flex-[2_1_280px] flex-col gap-[14px] bg-pan px-5 py-[18px] mobile:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="hexagon h-6 w-5 flex-none" />
          <Skeleton className="h-[15px] w-[148px]" delayMs={50} />
          <Skeleton className="h-5 w-[58px]" delayMs={100} />
        </div>
        <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-3">
          <span className="flex flex-col gap-[6px]">
            <Skeleton className="h-[10px] w-[56px]" delayMs={100} />
            <Skeleton className="h-10 bg-pan2" delayMs={150} />
          </span>
          <span className="flex flex-col gap-[6px]">
            <Skeleton className="h-[10px] w-[44px]" delayMs={150} />
            <Skeleton className="h-10 bg-pan2" delayMs={200} />
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[10px] w-[176px] max-w-full" delayMs={200} />
          <Skeleton className="h-10 bg-pan2" delayMs={250} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-[26px] w-[88px] bg-pan2" delayMs={300} />
          <Skeleton className="h-[26px] w-[74px] bg-pan2" delayMs={350} />
          <Skeleton className="h-[26px] w-[132px] bg-pan2" delayMs={400} />
        </div>
        <div className="flex flex-col gap-[9px]">
          <Skeleton className="h-[10px] w-[92px]" delayMs={400} />
          <Skeleton className="h-[13px] w-[84%]" delayMs={450} />
          <Skeleton className="h-[13px] w-[72%]" delayMs={500} />
        </div>
      </div>
    </>
  )
}
