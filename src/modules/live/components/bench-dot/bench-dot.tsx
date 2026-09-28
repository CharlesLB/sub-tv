import type { PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM } from '@/modules/matches/client'
import type { PlayerMatchState } from '../../state/live-state'
import { MARKS_VARIANT, PlayerMarks } from '../player-marks/player-marks'
import { benchDotStyles as styles } from './bench-dot.styles'

const KEYBOARD_CLICK_DETAIL = 0

type BenchDotProps = {
  player: LivePlayerVM
  matchState: PlayerMatchState
  teamColor: string
  isDragged: boolean
  isHighlighted: boolean
  onPointerDown: (playerId: string, event: ReactPointerEvent<HTMLElement>) => void
  onHoverStart: (playerId: string, element: Element) => void
  onHoverEnd: (playerId: string) => void
  onKeyboardActivate: (playerId: string) => void
}

export function BenchDot({ player, matchState, teamColor, isDragged, isHighlighted, ...handlers }: BenchDotProps) {
  const hasLeft = matchState.subbedOut

  return (
    <button
      type="button"
      aria-label={`Reserva camisa ${player.shirtNumber} — ${player.name}${hasLeft ? ' (substituído)' : ''}`}
      aria-disabled={hasLeft}
      onPointerDown={(event) => handlers.onPointerDown(player.playerId, event)}
      onPointerEnter={(event) => handlers.onHoverStart(player.playerId, event.currentTarget)}
      onPointerLeave={() => handlers.onHoverEnd(player.playerId)}
      onClick={(event) => {
        if (event.detail === KEYBOARD_CLICK_DETAIL && !hasLeft) handlers.onKeyboardActivate(player.playerId)
      }}
      className={cn(styles.button, hasLeft ? styles.buttonSubbedOut : styles.buttonAvailable, isDragged && styles.buttonDragged)}
    >
      <span
        className={cn(styles.badge, hasLeft ? styles.badgeSubbedOut : isDragged ? styles.badgeDragged : styles.badgeIdle, isHighlighted && !hasLeft && styles.badgeHighlighted)}
        style={hasLeft ? undefined : { background: teamColor }}
      >
        <span className={cn(styles.shirtNumber, hasLeft ? styles.shirtNumberSubbedOut : styles.shirtNumberAvailable)}>{player.shirtNumber}</span>
        <PlayerMarks state={matchState} variant={MARKS_VARIANT.BENCH} />
      </span>
      <span className={cn(styles.name, hasLeft ? styles.nameSubbedOut : styles.nameAvailable)}>{player.shortName}</span>
    </button>
  )
}
