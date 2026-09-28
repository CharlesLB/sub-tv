'use client'

import { useEffect, useEffectEvent } from 'react'
import { useLiveState } from '../state/live-context'
import { DIRECTION, nextPlayerInDirection, type Direction } from '../state/selectors'
import { useLiveCommands } from '../state/use-live-commands'

const KEY = { ESCAPE: 'Escape', GOAL: 'g', ASSIST: 'a', CARD: 'c', SUBSTITUTION: 's' } as const

const ARROW_DIRECTION: Record<string, Direction> = {
  ArrowUp: DIRECTION.UP,
  ArrowDown: DIRECTION.DOWN,
  ArrowLeft: DIRECTION.LEFT,
  ArrowRight: DIRECTION.RIGHT,
}

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

const isTyping = (target: EventTarget | null): boolean => target instanceof HTMLElement && (TYPING_TAGS.has(target.tagName) || target.isContentEditable)

type PlacedPlayer = { playerId: string; x: number; y: number }

type ShortcutOptions = { placedPlayers: PlacedPlayer[]; onEscape: () => void }

export const useLiveShortcuts = ({ placedPlayers, onEscape }: ShortcutOptions): void => {
  const { selectedPlayerId, cardPickerOpen } = useLiveState()
  const commands = useLiveCommands()

  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === KEY.ESCAPE) {
      onEscape()
      commands.closeOverlays()
      return
    }
    if (cardPickerOpen || isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return

    const direction = ARROW_DIRECTION[event.key]
    if (direction) {
      event.preventDefault()
      commands.select(nextPlayerInDirection(placedPlayers, selectedPlayerId, direction))
      return
    }

    const selected = selectedPlayerId ?? ''
    const shortcuts: Record<string, () => void> = {
      [KEY.GOAL]: () => commands.recordGoal(selected),
      [KEY.ASSIST]: () => commands.recordAssist(selected),
      [KEY.CARD]: () => commands.openCardPicker(),
      [KEY.SUBSTITUTION]: () => commands.startSubstitution(),
    }
    const shortcut = shortcuts[event.key.toLowerCase()]
    if (!shortcut) return
    event.preventDefault()
    shortcut()
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKey(event)
    window.addEventListener('keydown', listener)

    return () => window.removeEventListener('keydown', listener)
  }, [])
}
