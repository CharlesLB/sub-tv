import type { PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM } from '@/modules/matches/client'
import type { PlayerMatchState } from '../../state/live-state'
import { MARKS_VARIANT, PlayerMarks } from '../player-marks/player-marks'

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
      className={cn(
        'flex w-full flex-none touch-none flex-col items-center gap-[2px] border-0 bg-transparent p-0',
        hasLeft ? 'cursor-not-allowed opacity-45' : 'cursor-grab',
        isDragged && 'opacity-50',
      )}
    >
      <span
        className={cn(
          'relative flex size-9 items-center justify-center rounded-full border-2 mobile:size-[30px]',
          hasLeft ? 'border-bd2 bg-transparent' : isDragged ? 'border-tx' : 'border-pan',
          isHighlighted && !hasLeft && 'shadow-[0_0_0_2px_var(--az)]',
        )}
        style={hasLeft ? undefined : { background: teamColor }}
      >
        <span className={cn('text-[14.4px] leading-none font-bold nums mobile:text-[12.6px]', hasLeft ? 'text-tx4' : 'text-bg')}>{player.shirtNumber}</span>
        <PlayerMarks state={matchState} variant={MARKS_VARIANT.BENCH} />
      </span>
      <span className={cn('max-w-full truncate text-center text-[10.5px] font-semibold tracking-[-.01em] whitespace-nowrap mobile:text-[9px]', hasLeft ? 'text-tx4' : 'text-tx2')}>
        {player.shortName}
      </span>
    </button>
  )
}
