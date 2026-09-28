import type { MouseEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { positionAbbreviation, positionLabel } from '../../labels'
import { toRosterName } from '../../squad-roster/squad-roster'
import type { SquadPlayerVM } from '../../types'
import { ROSTER_GRID_CLASS } from '../roster-grid/roster-grid'

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

  const statClass = 'text-[12.5px] text-tx4 nums @max-[430px]:text-[11.5px]'

  return (
    <a
      href={href}
      onClick={selectPlayer}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(ROSTER_GRID_CLASS, 'h-11 animate-rise-in items-center border-b border-bd text-tx transition-[background] duration-[140ms] hover:bg-pan', isSelected ? 'bg-pan' : 'bg-transparent')}
      style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms`, boxShadow: isSelected ? `inset 3px 0 0 ${teamColor}` : 'none' }}
    >
      <span className="text-[13.5px] font-bold nums" style={{ color: teamColor }}>
        {player.shirtNumber ?? EMPTY_VALUE}
      </span>
      <span className="min-w-0 truncate text-[14px] whitespace-nowrap">{toRosterName(player)}</span>
      <span className="truncate text-[11px] font-semibold tracking-[.12em] whitespace-nowrap text-tx2 uppercase @max-[430px]:text-[10.5px] @max-[430px]:tracking-[.08em] @max-[430px]:normal-case">
        <span className="@max-[430px]:hidden">{player.position ? positionLabel[player.position] : EMPTY_VALUE}</span>
        <span className="hidden @max-[430px]:inline">{player.position ? positionAbbreviation[player.position] : EMPTY_VALUE}</span>
      </span>
      <span className={statClass}>{player.games}</span>
      <span className={statClass}>{player.goals}</span>
      <span className={cn(statClass, 'text-right', player.curiosities.length > 0 ? 'text-ac' : 'text-bd3')}>{player.curiosities.length || EMPTY_VALUE}</span>
    </a>
  )
}
