import type { HoverState } from '../../interaction/interaction-state'
import { PLAYER } from '../../state/live-state.fixtures'

export const strikerHoverFixture: HoverState = { playerId: PLAYER.HOME_STRIKER, anchor: { x: 480, top: 400, bottom: 430 } }

export const strikerHoverNearTopFixture: HoverState = { playerId: PLAYER.HOME_STRIKER, anchor: { x: 480, top: 100, bottom: 130 } }

export const reserveHoverFixture: HoverState = { playerId: PLAYER.HOME_RESERVE, anchor: { x: 60, top: 400, bottom: 430 } }

export const unknownPlayerHoverFixture: HoverState = { playerId: 'jogador-inexistente', anchor: { x: 480, top: 400, bottom: 430 } }
