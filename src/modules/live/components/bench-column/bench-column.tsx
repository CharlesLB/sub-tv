'use client'

import { cn } from '@/lib/utils/cn'
import { categoryLabel } from '@/modules/championships/client'
import { SIDE, type Side } from '@/modules/matches/client'
import { DRAG_KIND } from '../../interaction/interaction-state'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { useLiveState } from '../../state/live-context'
import { BenchDot } from '../bench-dot/bench-dot'
import { benchColumnStyles as styles } from './bench-column.styles'

type BenchColumnProps = { side: Side; interactions: BoardInteractions }

export function BenchColumn({ side, interactions }: BenchColumnProps) {
  const { players, teams, category, selectedPlayerId, pendingSubstitution, playersById } = useLiveState()
  const team = teams[side]
  const { playerStates, drag } = interactions

  const reserves = players.flatMap((player) => {
    const matchState = playerStates[player.playerId]

    return player.side === side && matchState && !matchState.onPitch ? [{ player, matchState }] : []
  })

  const selectedSide = selectedPlayerId ? playersById[selectedPlayerId]?.side : undefined
  const isAwaitingEntry = pendingSubstitution && selectedSide === side

  return (
    <div data-screen-label="Banco" className={cn(styles.column, side === SIDE.HOME ? styles.columnHome : styles.columnAway)} style={{ borderTopColor: team.color }}>
      <div className={styles.header}>
        <div className={styles.title}>Banco</div>
        <div className={styles.team} style={{ color: team.color }}>
          {team.name} · {categoryLabel[category]}
        </div>
      </div>
      {reserves.map(({ player, matchState }) => (
        <BenchDot
          key={player.playerId}
          player={player}
          matchState={matchState}
          teamColor={team.color}
          isDragged={drag?.kind === DRAG_KIND.BENCH && drag.playerId === player.playerId}
          isHighlighted={isAwaitingEntry}
          onPointerDown={interactions.startBenchGesture}
          onHoverStart={interactions.showHover}
          onHoverEnd={interactions.hideHover}
          onKeyboardActivate={interactions.activateBenchPlayer}
        />
      ))}
    </div>
  )
}
