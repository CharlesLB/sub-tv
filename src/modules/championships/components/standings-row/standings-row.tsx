import { Crest } from '@/components/ui/crest/crest'
import { cn } from '@/lib/utils/cn'
import { type Category } from '../../categories'
import type { StandingRowVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { FormSquares } from '../form-squares/form-squares'
import { STANDINGS_GRID_CLASS } from '../standings-table/standings-grid'

const ROW_DELAY_STEP_MS = 28
const TOP_POSITIONS = 4
const BOTTOM_POSITIONS = 2

const formatGoalDifference = (goalDifference: number): string => (goalDifference > 0 ? `+${goalDifference}` : String(goalDifference))

const positionClass = (position: number, groupSize: number): string => {
  if (position <= TOP_POSITIONS) return 'text-ac'
  if (position > groupSize - BOTTOM_POSITIONS) return 'text-vm'

  return 'text-tx2'
}

const goalDifferenceClass = (goalDifference: number): string => {
  if (goalDifference > 0) return 'text-ac'
  if (goalDifference < 0) return 'text-vm'

  return 'text-tx4'
}

type StandingsRowProps = { row: StandingRowVM; index: number; groupSize: number; category: Category }

export function StandingsRow({ row, index, groupSize, category }: StandingsRowProps) {
  const numberCell = 'text-center font-mono text-[12px] nums text-tx2'

  return (
    <details className="group animate-rise-in" style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms` }}>
      <summary
        className={cn(
          STANDINGS_GRID_CLASS,
          'h-11 cursor-pointer list-none items-center border-b border-pan2 transition-colors duration-150 group-open:bg-pan2 hover:bg-pan2 compact:h-[46px] [&::-webkit-details-marker]:hidden',
        )}
      >
        <span className={cn('font-mono text-[12px] nums', positionClass(row.position, groupSize))}>{row.position}</span>
        <span className="flex min-w-0 items-center gap-[9px]">
          <span className="w-[9px] flex-none text-[13.5px] leading-none text-bd3 transition-transform duration-100 group-open:rotate-90 group-open:text-ac">›</span>
          <Crest color={row.team.color} imagePath={row.team.crestPath} width={18} />
          <span className="min-w-[54px] flex-[1_1_auto] truncate text-[12.6px] font-bold tracking-[-.01em]">{row.team.name}</span>
        </span>
        <span className="text-center text-[16px] font-extrabold text-tx nums compact:text-[15px]">{row.points}</span>
        <span className={numberCell}>{row.played}</span>
        <span className={cn(numberCell, 'compact:hidden')}>{row.wins}</span>
        <span className={cn(numberCell, 'compact:hidden')}>{row.draws}</span>
        <span className={cn(numberCell, 'compact:hidden')}>{row.losses}</span>
        <span className={cn('text-center font-mono text-[12px] nums', goalDifferenceClass(row.goalDifference))}>{formatGoalDifference(row.goalDifference)}</span>
        <FormSquares form={row.form} className="compact:hidden" />
      </summary>
      <div className="flex animate-fade-up flex-col gap-[10px] border-b border-bd bg-pan2 pt-[14px] pr-4 pb-[18px] pl-[46px] mobile:pl-4">
        <div className="flex flex-wrap items-center gap-[10px]">
          <span className="text-[11.3px] font-bold tracking-[-.01em] text-tx2">Elenco</span>
          <CategoryTag category={category} />
          <span className="text-[11px] text-tx4">{row.squad.length} atletas na súmula</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-[18px] gap-y-[6px]">
          {row.squad.map((player) => (
            <div key={player.playerId} className="flex min-w-0 items-baseline gap-[9px]">
              <span className="w-[22px] flex-none text-[12.6px] font-bold nums" style={{ color: row.team.color }}>
                {player.shirtNumber ?? '–'}
              </span>
              <span className="truncate text-[13.5px] whitespace-nowrap">{player.name}</span>
              {player.position ? <span className="ml-auto text-[9.5px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx4 uppercase">{player.position}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </details>
  )
}
