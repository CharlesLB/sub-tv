import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

const LINE_COLUMNS = [
  { key: 'home-keeper', className: 'left-[8%] w-[8%] justify-center', delays: [0], isFaint: false },
  { key: 'home-defense', className: 'left-[24%] w-[10%] justify-evenly items-center', delays: [80, 140, 200], isFaint: false },
  { key: 'home-attack', className: 'left-[40%] w-[10%] justify-evenly items-center', delays: [260, 320, 380], isFaint: false },
  { key: 'away-attack', className: 'right-[40%] w-[10%] justify-evenly items-center', delays: [440, 500, 560], isFaint: true },
  { key: 'away-defense', className: 'right-[24%] w-[10%] justify-evenly items-center', delays: [620, 680, 740], isFaint: true },
  { key: 'away-keeper', className: 'right-[8%] w-[8%] justify-center items-end', delays: [800], isFaint: true },
] as const

export function PitchSkeleton() {
  return (
    <div className="[container-type:size] col-start-2 row-start-1 flex min-h-0 min-w-0 flex-col items-center justify-start overflow-hidden bg-pan p-4 chamfer">
      <div className="relative aspect-[105/64] w-[min(100%,164cqh)] flex-[0_0_auto] animate-[skeleton_2.2s_ease-in-out_infinite] rounded-card border border-gr-borda turf">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gr-linha" />
        <div className="absolute top-1/2 left-1/2 aspect-square w-[17%] -translate-1/2 rounded-full border border-gr-linha" />
        <div className="absolute top-[21%] left-0 h-[58%] w-[15%] rounded-card border border-l-0 border-gr-linha" />
        <div className="absolute top-[21%] right-0 h-[58%] w-[15%] rounded-card border border-r-0 border-gr-linha" />
        {LINE_COLUMNS.map((column) => (
          <div key={column.key} className={cn('absolute top-0 bottom-0 flex flex-col', column.className)}>
            {column.delays.map((delayMs) => (
              <Skeleton key={delayMs} className={cn('size-[26px] rounded-full', column.isFaint && 'bg-pan2')} delayMs={delayMs} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
