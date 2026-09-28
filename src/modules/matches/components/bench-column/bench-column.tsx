import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import type { SetupPlayerVM, SetupTeamVM } from '../../types'
import { shortNameOf } from '../../wizard-selectors/wizard-selectors'
import { benchColumnStyles as styles } from './bench-column.styles'

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
    <section aria-label={`Banco ${team.name}`} className={cn(styles.column, placement === 'left' ? styles.columnLeft : styles.columnRight)} style={{ borderTopColor: team.color }}>
      <div className={styles.header}>
        <div className={styles.title}>Banco</div>
        <div className={styles.teamLine} style={{ color: team.color }}>
          {team.name} · {categoryLabel}
        </div>
        <div className={cn(styles.starterCount, isFull ? styles.starterCountFull : styles.starterCountIncomplete)}>
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
            className={cn(styles.reserve, isDragging && styles.reserveDragging)}
          >
            <span className={cn(styles.reserveDot, isDragging ? styles.reserveDotDragging : styles.reserveDotIdle)} style={{ background: team.color }}>
              <span className={styles.reserveShirtNumber}>{player.shirtNumber}</span>
            </span>
            <span className={styles.reserveName}>{shortNameOf(player)}</span>
          </button>
        )
      })}
    </section>
  )
}
