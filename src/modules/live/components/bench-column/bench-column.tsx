'use client'

import { categoryLabel } from '@/modules/championships/client'
import { SIDE, type Side } from '@/modules/matches/client'
import { DRAG_KIND } from '../../interaction/interaction-state'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { useLiveState } from '../../state/live-context'
import { BenchDot } from '../bench-dot/bench-dot'

type BenchColumnProps = { side: Side; interactions: BoardInteractions }

export function BenchColumn({ side, interactions }: BenchColumnProps) {
  const { players, teams, category, selectedPlayerId, pendingSubstitution, playersById } = useLiveState()
  const team = teams[side]
  const { playerStates, drag } = interactions
  const reserves = players.filter((player) => player.side === side && !playerStates[player.playerId]?.onPitch)
  const selectedSide = selectedPlayerId ? playersById[selectedPlayerId]?.side : undefined
  const isAwaitingEntry = pendingSubstitution && selectedSide === side

  return (
    <div
      data-screen-label="Banco"
      className="row-start-1 flex min-h-0 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto border-t-2 bg-pan px-2 pb-[10px] mobile:px-1"
      style={{ gridColumn: side === SIDE.HOME ? 1 : 3, borderTopColor: team.color }}
    >
      <div className="sticky top-0 z-[2] flex-none self-stretch border-b border-bd bg-pan pt-[10px] pb-[6px] text-center">
        <div className="text-[9.5px] font-bold tracking-[-.01em] text-tx4">Banco</div>
        <div className="mt-[2px] text-[11px] leading-[1.25] font-bold tracking-[-.01em] text-pretty mobile:text-[9px]" style={{ color: team.color }}>
          {team.name} · {categoryLabel[category]}
        </div>
      </div>
      {reserves.map((player) => {
        const matchState = playerStates[player.playerId]

        return matchState ? (
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
        ) : null
      })}
    </div>
  )
}
