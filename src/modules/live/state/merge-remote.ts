import * as R from 'remeda'
import { MATCH_PERIOD, type MatchPeriod, type RemoteEvent, type RemoteSnapshot } from '@/modules/matches/client'
import { CLOCK_SYNC_KEY, type LiveEvent, type LiveState, positionSyncKey, SYNC_STATE } from './live-state'

const PERIOD_ORDER: Record<MatchPeriod, number> = {
  [MATCH_PERIOD.BEFORE_START]: 0,
  [MATCH_PERIOD.FIRST_HALF]: 1,
  [MATCH_PERIOD.HALF_TIME]: 2,
  [MATCH_PERIOD.SECOND_HALF]: 3,
  [MATCH_PERIOD.FIRST_EXTRA_HALF]: 4,
  [MATCH_PERIOD.SECOND_EXTRA_HALF]: 5,
  [MATCH_PERIOD.PENALTIES]: 6,
  [MATCH_PERIOD.FULL_TIME]: 7,
}

const isPending = (state: LiveState, syncKey: string): boolean => (state.pendingSyncCounts[syncKey] ?? 0) > 0

const toLiveEvent = (remote: RemoteEvent): LiveEvent => ({
  key: remote.key,
  side: remote.side,
  type: remote.type,
  period: remote.period,
  minute: remote.minute,
  playerId: remote.playerId,
  playerOutId: remote.playerOutId,
  assistPlayerId: remote.assistPlayerId,
  goalType: remote.goalType,
  fromSecondYellow: remote.fromSecondYellow,
  source: remote.source,
  appliedToLineup: false,
  syncState: SYNC_STATE.CONFIRMED,
})

const chronologically = (events: LiveEvent[]): LiveEvent[] => R.sortBy(events, [(event) => PERIOD_ORDER[event.period], 'asc'], [(event) => event.minute ?? -1, 'asc'])

const insertRemote = (state: LiveState, remote: RemoteEvent): LiveState => {
  const knownPlayers = [remote.playerId, remote.playerOutId].every((playerId) => playerId === null || playerId in state.playersById)
  if (!knownPlayers || state.revertedKeys.includes(remote.key)) return state

  return { ...state, events: chronologically([...state.events, toLiveEvent(remote)]) }
}

export const mergeRemoteEvent = (state: LiveState, remote: RemoteEvent): LiveState => {
  const local = state.events.find((event) => event.key === remote.key)
  if (local && isPending(state, remote.key)) return state
  if (!remote.isActive) return local ? { ...state, events: state.events.filter((event) => event.key !== remote.key) } : state
  if (!local) return insertRemote(state, remote)

  const updated = toLiveEvent(remote)

  return { ...state, events: state.events.map((event) => (event.key === remote.key ? updated : event)) }
}

export const mergeRemoteSnapshot = (state: LiveState, snapshot: RemoteSnapshot): LiveState => {
  const acceptedPositions = snapshot.positions.filter((position) => position.playerId in state.playersById && !isPending(state, positionSyncKey(position.playerId)))
  const positions = { ...state.positions, ...Object.fromEntries(acceptedPositions.map((position) => [position.playerId, { x: position.x, y: position.y }])) }
  const clock = snapshot.clock && !isPending(state, CLOCK_SYNC_KEY) ? snapshot.clock : state.clock

  return { ...state, positions, clock }
}
