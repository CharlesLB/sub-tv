import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import type { SetupPlayerVM, SetupTeamVM } from '../../types'
import { shortNameOf } from '../../wizard-selectors/wizard-selectors'

type BenchColumnProps = {
  team: SetupTeamVM
  categoryLabel: string
  starterCount: number
  reserves: SetupPlayerVM[]
  draggingPlayerId: string | null
  placement: 'left' | 'right'
  onPointerDown: (player: SetupPlayerVM, event: PointerEvent<HTMLButtonElement>) => void
  onKeyboardAdd: (player: SetupPlayerVM) => void
}

const ACTIVATION_KEYS = new Set(['Enter', ' '])

export function BenchColumn({ team, categoryLabel, starterCount, reserves, draggingPlayerId, placement, onPointerDown, onKeyboardAdd }: BenchColumnProps) {
  const isFull = starterCount >= STARTERS_PER_TEAM

  const addFromKeyboard = (player: SetupPlayerVM, event: KeyboardEvent<HTMLButtonElement>) => {
    if (!ACTIVATION_KEYS.has(event.key)) return
    event.preventDefault()
    onKeyboardAdd(player)
  }

  return (
    <div
      aria-label={`Banco ${team.name}`}
      className={cn('row-start-1 flex min-h-0 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto border-t-2 bg-pan px-2 py-[10px]', placement === 'left' ? 'col-start-1' : 'col-start-3')}
      style={{ borderTopColor: team.color }}
    >
      <div className="sticky top-0 z-[1] w-full bg-pan pb-[6px] text-center">
        <div className="text-[9.5px] font-bold tracking-[-.01em] text-tx4">Banco</div>
        <div className="mt-[2px] text-[9.9px] leading-[1.25] font-bold tracking-[-.01em] text-pretty" style={{ color: team.color }}>
          {team.name} · {categoryLabel}
        </div>
        <div className={cn('mt-[3px] text-[9px] font-bold tracking-[-.01em]', isFull ? 'text-ac' : 'text-am')}>
          {starterCount}/{STARTERS_PER_TEAM} em campo
        </div>
      </div>
      {reserves.map((player) => {
        const isDragging = draggingPlayerId === player.playerId

        return (
          <button
            key={player.playerId}
            type="button"
            title={isFull ? `Arraste até um titular no campo para trocar — ${player.name}` : `${player.name} — clique para escalar ou arraste até o campo`}
            aria-label={`Reserva camisa ${player.shirtNumber}, ${player.name}`}
            onPointerDown={(event) => onPointerDown(player, event)}
            onKeyDown={(event) => addFromKeyboard(player, event)}
            className={cn('flex w-[100px] max-w-full flex-none cursor-grab touch-none flex-col items-center gap-[2px] bg-transparent select-none', isDragging && 'opacity-50')}
          >
            <span className={cn('relative flex size-9 items-center justify-center rounded-full border-2', isDragging ? 'border-tx' : 'border-pan')} style={{ background: team.color }}>
              <span className="text-[14.4px] leading-none font-bold text-bg nums">{player.shirtNumber}</span>
            </span>
            <span className="max-w-full truncate text-center text-[9.5px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx2">{shortNameOf(player)}</span>
          </button>
        )
      })}
    </div>
  )
}
