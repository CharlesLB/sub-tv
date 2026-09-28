import { addMinute, advanceClock } from './clock-handlers'
import { openCardPicker, recordAssist, recordCard, recordGoal, recordSubstitution, startSubstitution } from './event-handlers'
import { LIVE_ACTION, type LiveAction } from './live-actions'
import { type LiveState, SERVER_OPERATION } from './live-state'
import { mergeRemoteEvent, mergeRemoteSnapshot } from './merge-remote'
import { drainOutbox, markSyncFailed, markSyncRejected, settleSync, undoToast } from './sync-handlers'
import { dismissToast, enqueue } from './toasts'

export const liveReducer = (state: LiveState, action: LiveAction): LiveState => {
  switch (action.type) {
    case LIVE_ACTION.PLAYER_SELECTED:
      return { ...state, selectedPlayerId: action.playerId, pendingSubstitution: false }
    case LIVE_ACTION.GOAL_RECORDED:
      return recordGoal(state, action.playerId, action.clientId, action.nowMs)
    case LIVE_ACTION.ASSIST_RECORDED:
      return recordAssist(state, action.playerId)
    case LIVE_ACTION.CARD_RECORDED:
      return recordCard(state, action)
    case LIVE_ACTION.SUBSTITUTION_RECORDED:
      return recordSubstitution(state, action)
    case LIVE_ACTION.SUBSTITUTION_STARTED:
      return startSubstitution(state)
    case LIVE_ACTION.CARD_PICKER_OPENED:
      return openCardPicker(state)
    case LIVE_ACTION.OVERLAYS_CLOSED:
      return { ...state, cardPickerOpen: false, pendingSubstitution: false }
    case LIVE_ACTION.PLAYER_MOVED:
      return enqueue(
        {
          ...state,
          positions: { ...state.positions, [action.playerId]: action.point },
          selectedPlayerId: action.playerId,
        },
        { kind: SERVER_OPERATION.POSITION, playerId: action.playerId, point: action.point },
      )
    case LIVE_ACTION.CLOCK_ADVANCED:
      return advanceClock(state, action.nowMs)
    case LIVE_ACTION.CLOCK_MINUTE_ADDED:
      return addMinute(state)
    case LIVE_ACTION.UNDO_REQUESTED:
      return undoToast(state, action.toastId)
    case LIVE_ACTION.TOAST_DISMISSED:
      return dismissToast(state, action.toastId)
    case LIVE_ACTION.SYNC_CONFIRMED:
      return settleSync(state, action.syncKey)
    case LIVE_ACTION.SYNC_REJECTED:
      return markSyncRejected(state, action.syncKey, action.message)
    case LIVE_ACTION.SYNC_FAILED:
      return markSyncFailed(state)
    case LIVE_ACTION.SYNC_RECOVERED:
      return { ...state, isSyncFailing: false }
    case LIVE_ACTION.OUTBOX_DRAINED:
      return drainOutbox(state, action.count)
    case LIVE_ACTION.REMOTE_EVENT_RECEIVED:
      return mergeRemoteEvent(state, action.event)
    case LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED:
      return mergeRemoteSnapshot(state, action.snapshot)
    case LIVE_ACTION.STREAM_STATUS_CHANGED:
      return { ...state, streamStatus: action.status }
  }
}
