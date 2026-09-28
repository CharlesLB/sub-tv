import { cn } from '@/lib/utils/cn'
import type { SquadPlayerVM } from '../../types'
import { RosterRow } from '../roster-row/roster-row'
import { rosterTableStyles as styles } from './roster-table.styles'

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
      <div className={cn(styles.grid, styles.header)}>
        {COLUMNS.map((column, index) => (
          <span key={column.key} className={cn(styles.columnLabel, index === LAST_COLUMN_INDEX ? styles.lastColumnLabel : styles.columnLabelAligned)}>
            <span className={styles.fullLabel}>{column.label}</span>
            <span className={styles.compactLabel}>{column.compactLabel}</span>
          </span>
        ))}
      </div>
      <div className={styles.rows}>
        {players.map((player, index) => (
          <RosterRow key={player.id} player={player} index={index} href={hrefFor(player.id)} teamColor={teamColor} isSelected={player.id === selectedPlayerId} onSelect={onSelect} />
        ))}
        {players.length === 0 ? <p className={styles.emptyMessage}>{hasSearch ? `Nenhum atleta encontrado para “${searchText.trim()}”.` : 'Nenhum atleta vinculado a este time ainda.'}</p> : null}
      </div>
    </>
  )
}
