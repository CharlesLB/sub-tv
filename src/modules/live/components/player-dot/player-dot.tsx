import type { PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM, PitchPoint } from '@/modules/matches/client'
import type { PlayerMatchState } from '../../state/live-state'
import { MARKS_VARIANT, PlayerMarks } from '../player-marks/player-marks'

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
    <div
      className={cn('absolute flex w-[13%] -translate-1/2 flex-col items-center gap-[2px]', isDragged ? 'z-[6]' : isDropTarget ? 'z-[4]' : 'z-[2]')}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
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
        className={cn(
          'relative flex aspect-square w-[46%] touch-none items-center justify-center rounded-full border-[3px] border-gr-anel p-0 transition-[border-color] duration-150 hover:border-tx',
          isDragged ? 'cursor-grabbing' : 'cursor-grab',
          matchState.sentOff && 'opacity-60',
          isDropTarget ? 'shadow-[0_0_0_4px_var(--az)]' : isSelected && 'shadow-[0_0_0_3px_var(--tx)]',
        )}
        style={{ background: color }}
      >
        <span className="text-[clamp(9px,2.1cqw,15px)] leading-none font-bold text-bg nums">{player.shirtNumber}</span>
        <PlayerMarks state={matchState} variant={MARKS_VARIANT.PITCH} />
      </button>
      <div
        className={cn(
          'bg-gr-chip px-[5px] pt-px pb-[2px] font-bold tracking-[-.01em] whitespace-nowrap text-gr-tx [text-shadow:0_1px_2px_rgba(0,0,0,.35)] [@container(max-height:190px)]:hidden',
          isCompact ? 'text-[clamp(6px,1.7cqw,10px)]' : 'text-[clamp(7px,2.1cqw,14px)]',
        )}
      >
        {label}
      </div>
    </div>
  )
}
