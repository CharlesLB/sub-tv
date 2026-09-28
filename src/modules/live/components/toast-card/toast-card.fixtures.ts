import { type Toast, TOAST_TONE } from '../../state/live-state'
import { LIVE_MESSAGE } from '../../state/toasts'

export const goalToastFixture: Toast = {
  id: 1,
  message: 'GOL MARCADO — #9 Davi Moreira',
  tone: TOAST_TONE.OK,
  undo: { addedEventKeys: ['goal-home-9'], assistChange: null },
}

export const warningToastFixture: Toast = { id: 2, message: LIVE_MESSAGE.SELECT_PLAYER, tone: TOAST_TONE.WARN, undo: null }

export const infoToastFixture: Toast = { id: 3, message: LIVE_MESSAGE.HALF_TIME, tone: TOAST_TONE.INFO, undo: null }
