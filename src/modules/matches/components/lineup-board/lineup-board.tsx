'use client'

import { type Dispatch, type PointerEvent, useRef, useState } from 'react'
import { DOT_DRAG_BOUNDS, type FieldRectangle, findNearestStarter, isInsideField, type PointerPosition, RESERVE_DROP_BOUNDS, toFieldPoint } from '../../board-geometry/board-geometry'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import type { Side } from '../../live-match/live-match'
import type { PitchPoint } from '../../pitch-layout/pitch-layout'
import { isPrimaryPointer, trackPointerGesture } from '../../pointer-gesture/pointer-gesture'
import type { StarterPositions } from '../../starter-positions/starter-positions'
import type { SetupPlayerVM, SetupTeamVM } from '../../types'
import type { WizardAction } from '../../wizard-reducer/wizard-reducer'
import { shortNameOf } from '../../wizard-selectors/wizard-selectors'
import { BenchColumn } from '../bench-column/bench-column'
import { DragGhost } from '../drag-ghost/drag-ghost'
import { PitchDot } from '../pitch-dot/pitch-dot'
import { PitchMarkings } from '../pitch-markings/pitch-markings'
import { lineupBoardStyles as styles } from './lineup-board.styles'

export type BoardSideVM = { side: Side; team: SetupTeamVM; starterIds: string[]; positions: StarterPositions }

type DragState =
  | { kind: 'starter'; side: Side; playerId: string; point: PitchPoint }
  | { kind: 'reserve'; side: Side; player: SetupPlayerVM; color: string; pointer: PointerPosition; overStarterId: string | null; dropPoint: PitchPoint | null }

type LineupBoardProps = { sides: BoardSideVM[]; categoryLabel: string; dispatch: Dispatch<WizardAction> }

const BENCH_PLACEMENT = { home: 'left', away: 'right' } as const

export function LineupBoard({ sides, categoryLabel, dispatch }: LineupBoardProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const latestDrag = useRef<DragState | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)

  const updateDrag = (next: DragState | null) => {
    latestDrag.current = next
    setDrag(next)
  }

  const readField = (): FieldRectangle | null => {
    const rectangle = fieldRef.current?.getBoundingClientRect()

    return rectangle ? { left: rectangle.left, top: rectangle.top, width: rectangle.width, height: rectangle.height } : null
  }

  const startStarterDrag = (side: Side, playerId: string, event: PointerEvent<HTMLButtonElement>) => {
    if (!isPrimaryPointer(event)) return
    event.preventDefault()

    trackPointerGesture(event, {
      onDrag: (pointer) => {
        const field = readField()
        if (field) updateDrag({ kind: 'starter', side, playerId, point: toFieldPoint(pointer, field, DOT_DRAG_BOUNDS) })
      },
      onRelease: (hasDragged) => {
        const current = latestDrag.current
        if (hasDragged && current?.kind === 'starter') dispatch({ type: 'starter/moved', side, playerId, point: current.point })
        if (!hasDragged) dispatch({ type: 'starter/benched', side, playerId })
        updateDrag(null)
      },
    })
  }

  const startReserveDrag = (boardSide: BoardSideVM, player: SetupPlayerVM, event: PointerEvent<HTMLButtonElement>) => {
    if (!isPrimaryPointer(event)) return
    event.preventDefault()
    const { side, team, positions } = boardSide

    trackPointerGesture(event, {
      onDrag: (pointer) => {
        const field = readField()
        const overStarterId = field ? findNearestStarter(pointer, field, positions) : null
        const dropPoint = field && !overStarterId && isInsideField(pointer, field) ? toFieldPoint(pointer, field, RESERVE_DROP_BOUNDS) : null
        updateDrag({ kind: 'reserve', side, player, color: team.color, pointer, overStarterId, dropPoint })
      },
      onRelease: (hasDragged) => {
        const current = latestDrag.current
        const swappedPoint = current?.kind === 'reserve' && current.overStarterId ? positions[current.overStarterId] : undefined
        if (!hasDragged) dispatch({ type: 'reserve/placed', side, playerId: player.playerId, point: null })

        if (hasDragged && current?.kind === 'reserve' && current.overStarterId && swappedPoint) {
          dispatch({ type: 'reserve/swapped', side, reserveId: player.playerId, starterId: current.overStarterId, point: swappedPoint })
        }

        if (hasDragged && current?.kind === 'reserve' && !current.overStarterId && current.dropPoint) {
          dispatch({ type: 'reserve/placed', side, playerId: player.playerId, point: current.dropPoint })
        }

        updateDrag(null)
      },
    })
  }

  return (
    <>
      <div className={styles.board}>
        {sides.map((boardSide) => {
          const starterSet = new Set(boardSide.starterIds)

          return (
            <BenchColumn
              key={boardSide.side}
              team={boardSide.team}
              categoryLabel={categoryLabel}
              starterCount={boardSide.starterIds.length}
              reserves={boardSide.team.players.filter((player) => !starterSet.has(player.playerId))}
              draggingPlayerId={drag?.kind === 'reserve' ? drag.player.playerId : null}
              placement={BENCH_PLACEMENT[boardSide.side]}
              onPointerDown={(player, event) => startReserveDrag(boardSide, player, event)}
              onKeyboardAdd={(player) => dispatch({ type: 'reserve/placed', side: boardSide.side, playerId: player.playerId, point: null })}
            />
          )
        })}
        <div className={styles.fieldArea}>
          <div ref={fieldRef} data-field className={styles.field}>
            <PitchMarkings />
            {sides.flatMap((boardSide) =>
              boardSide.team.players
                .flatMap((player) => {
                  const savedPoint = boardSide.positions[player.playerId]

                  return savedPoint ? [{ player, savedPoint }] : []
                })
                .map(({ player, savedPoint }) => {
                  const isDragging = drag?.kind === 'starter' && drag.playerId === player.playerId

                  return (
                    <PitchDot
                      key={player.playerId}
                      shirtNumber={player.shirtNumber}
                      label={shortNameOf(player)}
                      description={`Camisa ${player.shirtNumber} — ${player.name}, ${boardSide.team.name}`}
                      color={boardSide.team.color}
                      point={isDragging ? drag.point : savedPoint}
                      isDragging={isDragging}
                      isSwapTarget={drag?.kind === 'reserve' && drag.overStarterId === player.playerId}
                      onPointerDown={(event) => startStarterDrag(boardSide.side, player.playerId, event)}
                      onKeyboardBench={() => dispatch({ type: 'starter/benched', side: boardSide.side, playerId: player.playerId })}
                    />
                  )
                }),
            )}
          </div>
        </div>
      </div>
      {drag?.kind === 'reserve' ? (
        <DragGhost shirtNumber={drag.player.shirtNumber} name={shortNameOf(drag.player)} color={drag.color} left={drag.pointer.clientX} top={drag.pointer.clientY} isOverTarget={false} />
      ) : null}
      <span className={styles.announcement} aria-live="polite">
        {sides.map((boardSide) => `${boardSide.team.name}: ${boardSide.starterIds.length} de ${STARTERS_PER_TEAM} em campo`).join('. ')}
      </span>
    </>
  )
}
