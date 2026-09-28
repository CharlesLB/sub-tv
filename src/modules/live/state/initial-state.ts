import * as R from 'remeda'
import { LIVE_EVENT_TYPE, type LiveEventVM, type LiveMatchSnapshot, type LivePlayerVM, type PitchPoint } from '@/modules/matches/client'
import { type LiveEvent, type LiveState, STREAM_STATUS, SYNC_STATE } from './live-state'
import { derivePlayerStates, pickInitialSelection } from './selectors'

const replayUnappliedSubstitutions = (positions: Record<string, PitchPoint>, events: LiveEvent[]): Record<string, PitchPoint> =>
  events.reduce((current, event) => {
    const outgoingPoint = event.playerOutId ? current[event.playerOutId] : undefined
    const isUnappliedSubstitution = event.type === LIVE_EVENT_TYPE.SUBSTITUTION && !event.appliedToLineup

    // biome-ignore lint/performance/noAccumulatingSpread: cada passo lê o acumulado anterior e a coleção tem poucas dezenas de itens
    return isUnappliedSubstitution && event.playerId && outgoingPoint ? { ...current, [event.playerId]: outgoingPoint } : current
  }, positions)

const withStarter = (players: LivePlayerVM[], playerId: string | null, isStarter: boolean, pitchPoint: PitchPoint | null): LivePlayerVM[] =>
  players.map((player) => (player.playerId === playerId ? { ...player, isStarter, pitchPoint: pitchPoint ?? player.pitchPoint } : player))

export const kickoffLineupOf = (players: LivePlayerVM[], events: LiveEventVM[]): LivePlayerVM[] =>
  events
    .filter((event) => event.type === LIVE_EVENT_TYPE.SUBSTITUTION && event.appliedToLineup)
    .toReversed()
    .reduce((current, substitution) => {
      const entering = current.find((player) => player.playerId === substitution.playerId)

      return withStarter(withStarter(current, substitution.playerId, false, null), substitution.playerOutId, true, entering?.pitchPoint ?? null)
    }, players)

export const createInitialState = (snapshot: LiveMatchSnapshot): LiveState => {
  const events: LiveEvent[] = snapshot.events.map((event) => ({ ...event, appliedToLineup: false, syncState: SYNC_STATE.CONFIRMED }))
  const players = kickoffLineupOf(snapshot.players, snapshot.events)
  const storedPositions = R.fromEntries(players.flatMap((player) => (player.pitchPoint ? [[player.playerId, player.pitchPoint] as const] : [])))

  return {
    matchId: snapshot.matchId,
    category: snapshot.championship.category,
    halfLengthMinutes: snapshot.halfLengthMinutes,
    teams: snapshot.teams,
    players,
    playersById: R.indexBy(players, (player) => player.playerId),
    positions: replayUnappliedSubstitutions(storedPositions, events),
    events,
    clock: snapshot.clock,
    selectedPlayerId: pickInitialSelection(players, derivePlayerStates(players, events)),
    cardPickerOpen: false,
    pendingSubstitution: false,
    toasts: [],
    nextToastId: 1,
    outbox: [],
    isSyncFailing: false,
    pendingSyncCounts: {},
    revertedKeys: [],
    streamStatus: STREAM_STATUS.CONNECTING,
  }
}
