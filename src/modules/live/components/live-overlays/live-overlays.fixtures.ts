import { DRAG_KIND, type DragState, type HoverState } from '../../interaction/interaction-state'
import { PLAYER } from '../../state/live-state.fixtures'

export const strikerHoverFixture: HoverState = { playerId: PLAYER.HOME_STRIKER, anchor: { x: 400, top: 320, bottom: 360 } }

export const benchDragFixture: DragState = { kind: DRAG_KIND.BENCH, playerId: PLAYER.HOME_RESERVE, clientX: 420, clientY: 300, targetPlayerId: PLAYER.HOME_MIDFIELDER }

export const dotDragFixture: DragState = { kind: DRAG_KIND.DOT, playerId: PLAYER.HOME_STRIKER, point: { x: 40, y: 40 } }
