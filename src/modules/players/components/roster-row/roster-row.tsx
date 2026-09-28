import type { MouseEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { positionAbbreviation, positionLabel } from '../../labels'
import { toRosterName } from '../../squad-roster/squad-roster'
import type { SquadPlayerVM } from '../../types'
import { rosterRowStyles as styles } from './roster-row.styles'

const ROW_DELAY_STEP_MS = 20
const EMPTY_VALUE = '—'

type RosterRowProps = {
  player: SquadPlayerVM
  index: number
  href: string
  teamColor: string
  isSelected: boolean
  onSelect: (playerId: string) => void
}

const isPlainClick = (event: MouseEvent<HTMLAnchorElement>): boolean => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

export function RosterRow({ player, index, href, teamColor, isSelected, onSelect }: RosterRowProps) {
  const selectPlayer = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return
    event.preventDefault()
    onSelect(player.id)
  }

  return (
    <a
      href={href}
      onClick={selectPlayer}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(styles.grid, styles.row, isSelected ? styles.rowSelected : styles.rowIdle)}
      style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms`, boxShadow: isSelected ? `inset 3px 0 0 ${teamColor}` : 'none' }}
    >
      <span className={styles.shirtNumber} style={{ color: teamColor }}>
        {player.shirtNumber ?? EMPTY_VALUE}
      </span>
      <span className={styles.name}>{toRosterName(player)}</span>
      <span className={styles.position}>
        <span className={styles.positionFull}>{player.position ? positionLabel[player.position] : EMPTY_VALUE}</span>
        <span className={styles.positionCompact}>{player.position ? positionAbbreviation[player.position] : EMPTY_VALUE}</span>
      </span>
      <span className={styles.stat}>{player.games}</span>
      <span className={styles.stat}>{player.goals}</span>
      <span className={cn(styles.stat, styles.curiosityCount, player.curiosities.length > 0 ? styles.curiosityCountFilled : styles.curiosityCountEmpty)}>
        {player.curiosities.length || EMPTY_VALUE}
      </span>
    </a>
  )
}
