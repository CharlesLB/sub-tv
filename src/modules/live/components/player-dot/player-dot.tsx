import type { PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM, PitchPoint } from '@/modules/matches/client'
import type { PlayerMatchState } from '../../state/live-state'
import { MARKS_VARIANT, PlayerMarks } from '../player-marks/player-marks'
import { playerDotStyles as styles } from './player-dot.styles'

const COMPACT_NAME_LENGTH = 5
const KEYBOARD_CLICK_DETAIL = 0
const FADED_COLOR_PERCENT = 35

type PlayerDotProps = {
  player: LivePlayerVM
  matchState: PlayerMatchState
  point: PitchPoint
  teamColor: string
  isSelected: boolean
  isDragged: boolean
  isDropTarget: boolean
  isCompact: boolean
  onPointerDown: (playerId: string, event: ReactPointerEvent<HTMLElement>) => void
  onHoverStart: (playerId: string, element: Element) => void
  onHoverEnd: (playerId: string) => void
  onKeyboardActivate: (playerId: string, element: Element) => void
}

export function PlayerDot({ player, matchState, point, teamColor, isSelected, isDragged, isDropTarget, isCompact, ...handlers }: PlayerDotProps) {
  const color = matchState.sentOff ? `color-mix(in srgb, ${teamColor} ${FADED_COLOR_PERCENT}%, transparent)` : teamColor
  const label = isCompact ? player.shortName.slice(0, COMPACT_NAME_LENGTH) : player.shortName

  return (
    <div className={cn(styles.wrapper, isDragged ? styles.wrapperDragged : isDropTarget ? styles.wrapperDropTarget : styles.wrapperResting)} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
      <button
        type="button"
        aria-label={`Camisa ${player.shirtNumber} — ${player.name}`}
        aria-pressed={isSelected}
        onPointerDown={(event) => handlers.onPointerDown(player.playerId, event)}
        onPointerEnter={(event) => handlers.onHoverStart(player.playerId, event.currentTarget)}
        onPointerLeave={() => handlers.onHoverEnd(player.playerId)}
        onClick={(event) => {
          if (event.detail === KEYBOARD_CLICK_DETAIL) handlers.onKeyboardActivate(player.playerId, event.currentTarget)
        }}
        className={cn(styles.dot, isDragged ? styles.dotDragged : styles.dotGrabbable, matchState.sentOff && styles.dotSentOff, isDropTarget ? styles.dotDropTarget : isSelected && styles.dotSelected)}
        style={{ background: color }}
      >
        <span className={styles.shirtNumber}>{player.shirtNumber}</span>
        <PlayerMarks state={matchState} variant={MARKS_VARIANT.PITCH} />
      </button>
      <div className={cn(styles.name, isCompact ? styles.nameCompact : styles.nameRegular)}>{label}</div>
    </div>
  )
}
