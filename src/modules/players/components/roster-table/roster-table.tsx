import { cn } from '@/lib/utils/cn'
import { EMPTY_SQUAD_MESSAGE } from '../../labels'
import { ROSTER_COLUMNS } from '../../roster-columns/roster-columns'
import type { SquadPlayerVM } from '../../types'
import { RosterRow } from '../roster-row/roster-row'
import { rosterTableStyles as styles } from './roster-table.styles'

const LAST_COLUMN_INDEX = ROSTER_COLUMNS.length - 1

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
        {ROSTER_COLUMNS.map((column, index) => (
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
        {players.length === 0 ? <p className={styles.emptyMessage}>{hasSearch ? `Nenhum atleta encontrado para “${searchText.trim()}”.` : EMPTY_SQUAD_MESSAGE}</p> : null}
      </div>
    </>
  )
}
