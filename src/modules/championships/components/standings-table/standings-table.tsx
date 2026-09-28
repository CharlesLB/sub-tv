import { cn } from '@/lib/utils/cn'
import type { Category } from '../../categories'
import type { StandingGroupVM } from '../../types'
import { StandingsRow } from '../standings-row/standings-row'
import { STANDINGS_GRID_CLASS } from './standings-grid'

const HEADERS = [
  { label: '#', className: 'text-left' },
  { label: 'Clube', className: 'text-left' },
  { label: 'PTS', className: 'text-center' },
  { label: 'J', className: 'text-center' },
  { label: 'V', className: 'text-center compact:hidden' },
  { label: 'E', className: 'text-center compact:hidden' },
  { label: 'D', className: 'text-center compact:hidden' },
  { label: 'SG', className: 'text-center' },
  { label: 'Últimos 5', className: 'text-right compact:hidden' },
] as const

type StandingsTableProps = { group: StandingGroupVM; category: Category }

export function StandingsTable({ group, category }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-bd bg-pan">
      {group.groupName ? (
        <div className="border-b border-bd px-[14px] py-2 text-[11.3px] font-bold tracking-[-.01em] text-tx2">Grupo {group.groupName}</div>
      ) : null}
      <div className={cn(STANDINGS_GRID_CLASS, 'border-b border-bd bg-pan2 py-[9px] compact:py-2')}>
        {HEADERS.map((header) => (
          <span key={header.label} className={cn('text-[10px] font-semibold tracking-[.14em] whitespace-nowrap text-tx4 compact:text-[9px] compact:tracking-[.1em]', header.className)}>
            {header.label}
          </span>
        ))}
      </div>
      {group.rows.map((row, index) => (
        <StandingsRow key={row.seasonTeamId} row={row} index={index} groupSize={group.rows.length} category={category} />
      ))}
    </div>
  )
}
