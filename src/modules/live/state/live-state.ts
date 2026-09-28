import type { Category } from '@/modules/championships/client'
import type { LiveClock, LiveEventVM, LivePlayerVM, LiveTeamVM, PitchPoint, Side } from '@/modules/matches/client'

export const SYNC_STATE = { PENDING: 'pending', CONFIRMED: 'confirmed' } as const

export type SyncState = (typeof SYNC_STATE)[keyof typeof SYNC_STATE]

export type LiveEvent = LiveEventVM & { syncState: SyncState }

export const TOAST_TONE = { OK: 'ok', WARN: 'warn', INFO: 'info' } as const

export type ToastTone = (typeof TOAST_TONE)[keyof typeof TOAST_TONE]

export type AssistChange = { goalKey: string; previousAssistPlayerId: string | null }

export type UndoEntry = { addedEventKeys: string[]; assistChange: AssistChange | null }

export type Toast = { id: number; message: string; tone: ToastTone; undo: UndoEntry | null }

export const SERVER_OPERATION = {
  RECORD: 'record',
  SUBSTITUTION: 'substitution',
  REVERT: 'revert',
  ASSIST: 'assist',
  CLOCK: 'clock',
  POSITION: 'position',
} as const

export type ServerOperation =
  | { kind: typeof SERVER_OPERATION.RECORD; event: LiveEvent }
  | { kind: typeof SERVER_OPERATION.SUBSTITUTION; event: LiveEvent; pitchPoint: PitchPoint | null }
  | { kind: typeof SERVER_OPERATION.REVERT; eventKey: string }
  | { kind: typeof SERVER_OPERATION.ASSIST; goalKey: string; assistPlayerId: string | null }
  | { kind: typeof SERVER_OPERATION.CLOCK; clock: LiveClock }
  | { kind: typeof SERVER_OPERATION.POSITION; playerId: string; point: PitchPoint }

export const CLOCK_SYNC_KEY = 'clock'
const POSITION_SYNC_PREFIX = 'position:'

export const syncKeyOf = (operation: ServerOperation): string => {
  switch (operation.kind) {
    case SERVER_OPERATION.RECORD:
    case SERVER_OPERATION.SUBSTITUTION:
      return operation.event.key
    case SERVER_OPERATION.REVERT:
      return operation.eventKey
    case SERVER_OPERATION.ASSIST:
      return operation.goalKey
    case SERVER_OPERATION.CLOCK:
      return CLOCK_SYNC_KEY
    case SERVER_OPERATION.POSITION:
      return `${POSITION_SYNC_PREFIX}${operation.playerId}`
  }
}

export const positionSyncKey = (playerId: string): string => `${POSITION_SYNC_PREFIX}${playerId}`

export const STREAM_STATUS = { CONNECTING: 'connecting', CONNECTED: 'connected', RECONNECTING: 'reconnecting' } as const

export type StreamStatus = (typeof STREAM_STATUS)[keyof typeof STREAM_STATUS]

export type LiveState = {
  matchId: string
  category: Category
  halfLengthMinutes: number
  teams: Record<Side, LiveTeamVM>
  players: LivePlayerVM[]
  playersById: Record<string, LivePlayerVM>
  positions: Record<string, PitchPoint>
  events: LiveEvent[]
  clock: LiveClock
  selectedPlayerId: string | null
  cardPickerOpen: boolean
  pendingSubstitution: boolean
  toasts: Toast[]
  nextToastId: number
  outbox: ServerOperation[]
  isSyncFailing: boolean
  pendingSyncCounts: Record<string, number>
  revertedKeys: string[]
  streamStatus: StreamStatus
}

export type PlayerMatchState = {
  onPitch: boolean
  goals: number
  assists: number
  yellowCards: number
  sentOff: boolean
  sentOffBySecondYellow: boolean
  subbedIn: boolean
  subbedOut: boolean
}
