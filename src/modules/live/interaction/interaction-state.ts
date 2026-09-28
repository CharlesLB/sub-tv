import type { PitchPoint } from '@/modules/matches/client'

export type Anchor = { x: number; top: number; bottom: number }

export type HoverState = { playerId: string; anchor: Anchor }

export type MenuState = { playerId: string; anchor: Anchor }

export const DRAG_KIND = { DOT: 'dot', BENCH: 'bench' } as const

export type DragState =
  { kind: typeof DRAG_KIND.DOT; playerId: string; point: PitchPoint } | { kind: typeof DRAG_KIND.BENCH; playerId: string; clientX: number; clientY: number; targetPlayerId: string | null }

export const anchorOf = (element: Element): Anchor => {
  const rect = element.getBoundingClientRect()

  return { x: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom }
}
