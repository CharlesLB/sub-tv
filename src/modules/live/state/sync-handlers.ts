import * as R from 'remeda'
import { type LiveState, SERVER_OPERATION, type ServerOperation, SYNC_STATE, TOAST_TONE } from './live-state'
import { dismissToast, enqueue, LIVE_MESSAGE, pushToast, warn } from './toasts'

export const undoToast = (state: LiveState, toastId: number): LiveState => {
  const undo = state.toasts.find((toast) => toast.id === toastId)?.undo
  const dismissed = dismissToast(state, toastId)
  if (!undo) return dismissed

  const removedKeys = new Set(undo.addedEventKeys)
  const reverts: ServerOperation[] = state.events.filter((event) => removedKeys.has(event.key)).map((event) => ({ kind: SERVER_OPERATION.REVERT, eventKey: event.key }))
  const remaining = dismissed.events.filter((event) => !removedKeys.has(event.key))
  const assistChange = undo.assistChange
  const restoredGoal = assistChange ? remaining.find((event) => event.key === assistChange.goalKey) : undefined
  const assistRestores: ServerOperation[] = assistChange && restoredGoal ? [{ kind: SERVER_OPERATION.ASSIST, goalKey: assistChange.goalKey, assistPlayerId: assistChange.previousAssistPlayerId }] : []
  const events = assistChange ? remaining.map((event) => (event.key === assistChange.goalKey ? { ...event, assistPlayerId: assistChange.previousAssistPlayerId } : event)) : remaining

  return enqueue({ ...dismissed, events, revertedKeys: [...dismissed.revertedKeys, ...undo.addedEventKeys] }, ...reverts, ...assistRestores)
}

export const settleSync = (state: LiveState, syncKey: string): LiveState => {
  const remaining = (state.pendingSyncCounts[syncKey] ?? 0) - 1
  const pendingSyncCounts = remaining > 0 ? { ...state.pendingSyncCounts, [syncKey]: remaining } : R.omit(state.pendingSyncCounts, [syncKey])

  return {
    ...state,
    pendingSyncCounts,
    events: remaining > 0 ? state.events : state.events.map((event) => (event.key === syncKey ? { ...event, syncState: SYNC_STATE.CONFIRMED } : event)),
  }
}

export const markSyncFailed = (state: LiveState): LiveState => (state.isSyncFailing ? state : warn({ ...state, isSyncFailing: true }, LIVE_MESSAGE.SYNC_FAILED))

export const markSyncRejected = (state: LiveState, syncKey: string, message: string): LiveState => pushToast(settleSync(state, syncKey), `Não salvo — ${message}`, TOAST_TONE.WARN)

export const drainOutbox = (state: LiveState, count: number): LiveState => ({ ...state, outbox: state.outbox.slice(count) })
