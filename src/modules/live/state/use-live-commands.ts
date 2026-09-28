'use client'

import type { PitchPoint } from '@/modules/matches/client'
import { type CardColor, LIVE_ACTION } from './live-actions'
import { useLiveDispatch } from './live-context'

const newClientId = (): string => crypto.randomUUID()

export const useLiveCommands = () => {
  const dispatch = useLiveDispatch()

  return {
    select: (playerId: string | null) => dispatch({ type: LIVE_ACTION.PLAYER_SELECTED, playerId }),
    recordGoal: (playerId: string) => dispatch({ type: LIVE_ACTION.GOAL_RECORDED, playerId, clientId: newClientId(), nowMs: Date.now() }),
    recordAssist: (playerId: string) => dispatch({ type: LIVE_ACTION.ASSIST_RECORDED, playerId }),
    recordCard: (playerId: string, color: CardColor) => dispatch({ type: LIVE_ACTION.CARD_RECORDED, playerId, color, clientIds: [newClientId(), newClientId()], nowMs: Date.now() }),
    substitute: (playerOutId: string, playerInId: string) => dispatch({ type: LIVE_ACTION.SUBSTITUTION_RECORDED, playerOutId, playerInId, clientId: newClientId(), nowMs: Date.now() }),
    startSubstitution: () => dispatch({ type: LIVE_ACTION.SUBSTITUTION_STARTED }),
    openCardPicker: () => dispatch({ type: LIVE_ACTION.CARD_PICKER_OPENED }),
    closeOverlays: () => dispatch({ type: LIVE_ACTION.OVERLAYS_CLOSED }),
    movePlayer: (playerId: string, point: PitchPoint) => dispatch({ type: LIVE_ACTION.PLAYER_MOVED, playerId, point }),
    advanceClock: () => dispatch({ type: LIVE_ACTION.CLOCK_ADVANCED, nowMs: Date.now() }),
    addMinute: () => dispatch({ type: LIVE_ACTION.CLOCK_MINUTE_ADDED }),
    undo: (toastId: number) => dispatch({ type: LIVE_ACTION.UNDO_REQUESTED, toastId }),
    dismissToast: (toastId: number) => dispatch({ type: LIVE_ACTION.TOAST_DISMISSED, toastId }),
  }
}

export type LiveCommands = ReturnType<typeof useLiveCommands>
