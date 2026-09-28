'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { PitchPoint } from '@/modules/matches/client'
import { useLiveState } from '../state/live-context'
import { derivePlayerStates } from '../state/selectors'
import { useLiveCommands } from '../state/use-live-commands'
import { anchorOf, DRAG_KIND, type Anchor, type DragState, type HoverState, type MenuState } from './interaction-state'
import { nearestDropTarget, pointFromPointer, type PlacedTarget } from './pitch-geometry'
import { startPointerGesture } from './pointer-gesture'

export const useBoardInteractions = () => {
  const state = useLiveState()
  const commands = useLiveCommands()
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [hover, setHover] = useState<HoverState | null>(null)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const playerStates = derivePlayerStates(state.players, state.events)

  const fieldRect = () => fieldRef.current?.getBoundingClientRect() ?? null

  const openMenu = (playerId: string, anchor: Anchor) => {
    commands.select(playerId)
    setHover(null)
    setMenu({ playerId, anchor })
  }

  const dropTargetsFor = (benchPlayerId: string): PlacedTarget[] => {
    const side = state.playersById[benchPlayerId]?.side

    return state.players.flatMap((player) => {
      const playerState = playerStates[player.playerId]
      const point = state.positions[player.playerId]

      return player.side === side && playerState?.onPitch && !playerState.sentOff && point ? [{ playerId: player.playerId, point }] : []
    })
  }

  const activateBenchPlayer = (playerId: string) => {
    const selected = state.selectedPlayerId ? state.playersById[state.selectedPlayerId] : undefined
    const selectedState = selected ? playerStates[selected.playerId] : undefined
    const benchPlayer = state.playersById[playerId]
    const canSubstitute = selected && selectedState?.onPitch && !selectedState.sentOff && selected.side === benchPlayer?.side

    if (selected && canSubstitute) commands.substitute(selected.playerId, playerId)
    else commands.select(playerId)
  }

  const startDotGesture = (playerId: string, event: ReactPointerEvent<HTMLElement>) => {
    const anchor = anchorOf(event.currentTarget)
    const gesture: { lastPoint: PitchPoint | null } = { lastPoint: null }

    startPointerGesture(event, {
      onDrag: (clientX, clientY) => {
        const rect = fieldRect()
        if (!rect) return
        gesture.lastPoint = pointFromPointer(rect, clientX, clientY)
        setHover(null)
        setDrag({ kind: DRAG_KIND.DOT, playerId, point: gesture.lastPoint })
      },
      onRelease: (wasDragged) => {
        setDrag(null)
        if (wasDragged && gesture.lastPoint) commands.movePlayer(playerId, gesture.lastPoint)
        else openMenu(playerId, anchor)
      },
    })
  }

  const startBenchGesture = (playerId: string, event: ReactPointerEvent<HTMLElement>) => {
    if (playerStates[playerId]?.subbedOut) return
    const gesture: { targetPlayerId: string | null } = { targetPlayerId: null }

    startPointerGesture(event, {
      onDrag: (clientX, clientY) => {
        const rect = fieldRect()
        gesture.targetPlayerId = rect ? nearestDropTarget(rect, dropTargetsFor(playerId), clientX, clientY) : null
        setHover(null)
        setDrag({ kind: DRAG_KIND.BENCH, playerId, clientX, clientY, targetPlayerId: gesture.targetPlayerId })
      },
      onRelease: (wasDragged) => {
        setDrag(null)
        if (!wasDragged) activateBenchPlayer(playerId)
        else if (gesture.targetPlayerId) commands.substitute(gesture.targetPlayerId, playerId)
      },
    })
  }

  return {
    fieldRef,
    drag,
    hover,
    menu,
    playerStates,
    startDotGesture,
    startBenchGesture,
    activateBenchPlayer,
    openMenu,
    closeMenu: () => setMenu(null),
    showHover: (playerId: string, element: Element) => (drag || menu ? undefined : setHover({ playerId, anchor: anchorOf(element) })),
    hideHover: (playerId: string) => setHover((current) => (current?.playerId === playerId ? null : current)),
    clearTransient: () => {
      setMenu(null)
      setHover(null)
    },
  }
}

export type BoardInteractions = ReturnType<typeof useBoardInteractions>
