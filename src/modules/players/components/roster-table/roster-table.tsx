import { cn } from '@/lib/utils/cn'
import type { SquadPlayerVM } from '../../types'
import { RosterRow } from '../roster-row/roster-row'
import { ROSTER_GRID_CLASS } from '../roster-grid/roster-grid'

const COLUMNS = [
  { key: 'number', label: 'Nº', compactLabel: 'Nº' },
  { key: 'name', label: 'Nome', compactLabel: 'Nome' },
  { key: 'position', label: 'Posição', compactLabel: 'Pos' },
  { key: 'games', label: 'J', compactLabel: 'J' },
  { key: 'goals', label: 'G', compactLabel: 'G' },
  { key: 'curiosities', label: 'Curios.', compactLabel: 'Cur' },
] as const
const LAST_COLUMN_INDEX = COLUMNS.length - 1

type RosterTableProps = {
  players: SquadPlayerVM[]
  teamColor: string
  selectedPlayerId: string | null
  searchText: string
  hrefFor: (playerId: string) => string
  onSelect: (playerId: string) => void
}

export function RosterTable({ players, teamColor, selectedPlayerId, searchText, hrefFor, onSelect }: RosterTableProps) {
  const hasSearch = searchText.trim() !== ''

  return (
    <>
      <div className={cn(ROSTER_GRID_CLASS, 'border-b border-bd py-2')}>
        {COLUMNS.map((column, index) => (
          <span
            key={column.key}
           
            className={cn(
              'text-[10.5px] font-semibold tracking-[.14em] whitespace-nowrap text-tx4 @max-[430px]:text-[9.5px] @max-[430px]:tracking-[.1em]',
              index === LAST_COLUMN_INDEX ? 'overflow-visible text-right' : 'truncate text-left',
            )}
          >
            <span className="@max-[430px]:hidden">{column.label}</span>
            <span className="hidden @max-[430px]:inline">{column.compactLabel}</span>
          </span>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {players.map((player, index) => (
          <RosterRow
            key={player.id}
            player={player}
            index={index}
            href={hrefFor(player.id)}
            teamColor={teamColor}
            isSelected={player.id === selectedPlayerId}
            onSelect={onSelect}
          />
        ))}
        {players.length === 0 ? (
          <p className="px-4 py-6 text-[12.5px] text-tx4">{hasSearch ? `Nenhum atleta encontrado para “${searchText.trim()}”.` : 'Nenhum atleta vinculado a este time ainda.'}</p>
        ) : null}
      </div>
    </>
  )
}
