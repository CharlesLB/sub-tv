import * as R from 'remeda'
import { type LiveState, type ServerOperation, syncKeyOf, TOAST_TONE, type ToastTone, type UndoEntry } from './live-state'

export const MAXIMUM_TOASTS = 3

export const LIVE_MESSAGE = {
  SELECT_PLAYER: 'Selecione um jogador na prancheta',
  PLAYER_SENT_OFF: 'Jogador expulso',
  PLAYER_ALREADY_SENT_OFF: 'Jogador já expulso',
  SENT_OFF_CANNOT_BE_SUBSTITUTED: 'Jogador expulso não É substituído',
  GOAL_BEFORE_ASSIST: 'Marque O gol antes da assistência',
  SCORER_CANNOT_ASSIST: 'Autor do gol não leva A assistência',
  START_BEFORE_ADDED_TIME: 'Comece O jogo para marcar acréscimo',
  INVALID_SUBSTITUTION: 'Substituição inválida — Quem entra precisa ser um reserva do mesmo time que ainda não saiu.',
  SYNC_FAILED: 'Falha ao salvar — Sem resposta do servidor. Os lances continuam na tela e são reenviados sozinhos.',
  HALF_TIME: 'Intervalo — 2º tempo pronto para começar',
  FULL_TIME: 'Fim de jogo',
  SECOND_HALF_STARTED: '2º tempo iniciado',
  FIRST_HALF_RESUMED: '1º tempo retomado',
} as const

export const pushToast = (state: LiveState, message: string, tone: ToastTone, undo: UndoEntry | null = null): LiveState => ({
  ...state,
  toasts: [...state.toasts, { id: state.nextToastId, message, tone, undo }].slice(-MAXIMUM_TOASTS),
  nextToastId: state.nextToastId + 1,
})

export const warn = (state: LiveState, message: string): LiveState => pushToast(state, message, TOAST_TONE.WARN)

export const inform = (state: LiveState, message: string): LiveState => pushToast(state, message, TOAST_TONE.INFO)

const countPending = (counts: Record<string, number>, operations: ServerOperation[]): Record<string, number> => ({
  ...counts,
  ...R.mapValues(R.countBy(operations, syncKeyOf), (addedCount, key) => (counts[key] ?? 0) + addedCount),
})

export const enqueue = (state: LiveState, ...operations: ServerOperation[]): LiveState => ({
  ...state,
  outbox: [...state.outbox, ...operations],
  pendingSyncCounts: countPending(state.pendingSyncCounts, operations),
})

export const dismissToast = (state: LiveState, toastId: number): LiveState => ({ ...state, toasts: state.toasts.filter((toast) => toast.id !== toastId) })
