'use client'

import type { PitchPoint } from '@/modules/matches/client'
import { anchorOf, DRAG_KIND } from '../../interaction/interaction-state'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { useLiveState } from '../../state/live-context'
import { PitchLines } from '../pitch-lines/pitch-lines'
import { PlayerDot } from '../player-dot/player-dot'
import { pitchStyles as styles } from './pitch.styles'

const CENTER_SPOT: PitchPoint = { x: 50, y: 50 }

type PitchProps = { interactions: BoardInteractions; isCompact: boolean }

export function Pitch({ interactions, isCompact }: PitchProps) {
  const { players, positions, teams, selectedPlayerId } = useLiveState()
  const { playerStates, drag, fieldRef } = interactions
  const draggedDot = drag?.kind === DRAG_KIND.DOT ? drag : null
  const dropTargetId = drag?.kind === DRAG_KIND.BENCH ? drag.targetPlayerId : null

  return (
    <div data-screen-label="Prancheta" className={styles.frame}>
      <div ref={fieldRef} className={styles.field}>
        <PitchLines />
        {players.flatMap((player) => {
          const matchState = playerStates[player.playerId]
          if (!matchState?.onPitch) return []
          const point = draggedDot?.playerId === player.playerId ? draggedDot.point : (positions[player.playerId] ?? CENTER_SPOT)

          return [
            <PlayerDot
              key={player.playerId}
              player={player}
              matchState={matchState}
              point={point}
              teamColor={teams[player.side].color}
              isSelected={selectedPlayerId === player.playerId}
              isDragged={draggedDot?.playerId === player.playerId}
              isDropTarget={dropTargetId === player.playerId}
              isCompact={isCompact}
              onPointerDown={interactions.startDotGesture}
              onHoverStart={interactions.showHover}
              onHoverEnd={interactions.hideHover}
              onKeyboardActivate={(playerId, element) => interactions.openMenu(playerId, anchorOf(element))}
            />,
          ]
        })}
      </div>
    </div>
  )
}
