import type { PitchPoint, RemoteEvent, RemoteSnapshot } from '@/modules/matches/client'
import type { StreamStatus } from './live-state'

export const CARD_COLOR = { YELLOW: 'yellow', RED: 'red' } as const

export type CardColor = (typeof CARD_COLOR)[keyof typeof CARD_COLOR]

export const LIVE_ACTION = {
  PLAYER_SELECTED: 'player/selected',
  GOAL_RECORDED: 'goal/recorded',
  ASSIST_RECORDED: 'assist/recorded',
  CARD_RECORDED: 'card/recorded',
  SUBSTITUTION_RECORDED: 'substitution/recorded',
  SUBSTITUTION_STARTED: 'substitution/started',
  CARD_PICKER_OPENED: 'card-picker/opened',
  OVERLAYS_CLOSED: 'overlays/closed',
  PLAYER_MOVED: 'player/moved',
  CLOCK_ADVANCED: 'clock/advanced',
  CLOCK_MINUTE_ADDED: 'clock/minute-added',
  UNDO_REQUESTED: 'undo/requested',
  TOAST_DISMISSED: 'toast/dismissed',
  SYNC_CONFIRMED: 'sync/confirmed',
  SYNC_REJECTED: 'sync/rejected',
  SYNC_FAILED: 'sync/failed',
  SYNC_RECOVERED: 'sync/recovered',
  OUTBOX_DRAINED: 'outbox/drained',
  REMOTE_EVENT_RECEIVED: 'remote/event-received',
  REMOTE_SNAPSHOT_RECEIVED: 'remote/snapshot-received',
  STREAM_STATUS_CHANGED: 'stream/status-changed',
} as const

export type LiveAction =
  | { type: typeof LIVE_ACTION.PLAYER_SELECTED; playerId: string | null }
  | { type: typeof LIVE_ACTION.GOAL_RECORDED; playerId: string; clientId: string; nowMs: number }
  | { type: typeof LIVE_ACTION.ASSIST_RECORDED; playerId: string }
  | { type: typeof LIVE_ACTION.CARD_RECORDED; playerId: string; color: CardColor; clientIds: readonly [string, string]; nowMs: number }
  | { type: typeof LIVE_ACTION.SUBSTITUTION_RECORDED; playerOutId: string; playerInId: string; clientId: string; nowMs: number }
  | { type: typeof LIVE_ACTION.SUBSTITUTION_STARTED }
  | { type: typeof LIVE_ACTION.CARD_PICKER_OPENED }
  | { type: typeof LIVE_ACTION.OVERLAYS_CLOSED }
  | { type: typeof LIVE_ACTION.PLAYER_MOVED; playerId: string; point: PitchPoint }
  | { type: typeof LIVE_ACTION.CLOCK_ADVANCED; nowMs: number }
  | { type: typeof LIVE_ACTION.CLOCK_MINUTE_ADDED }
  | { type: typeof LIVE_ACTION.UNDO_REQUESTED; toastId: number }
  | { type: typeof LIVE_ACTION.TOAST_DISMISSED; toastId: number }
  | { type: typeof LIVE_ACTION.SYNC_CONFIRMED; syncKey: string }
  | { type: typeof LIVE_ACTION.SYNC_REJECTED; syncKey: string; message: string }
  | { type: typeof LIVE_ACTION.SYNC_FAILED }
  | { type: typeof LIVE_ACTION.SYNC_RECOVERED }
  | { type: typeof LIVE_ACTION.OUTBOX_DRAINED; count: number }
  | { type: typeof LIVE_ACTION.REMOTE_EVENT_RECEIVED; event: RemoteEvent }
  | { type: typeof LIVE_ACTION.REMOTE_SNAPSHOT_RECEIVED; snapshot: RemoteSnapshot }
  | { type: typeof LIVE_ACTION.STREAM_STATUS_CHANGED; status: StreamStatus }
