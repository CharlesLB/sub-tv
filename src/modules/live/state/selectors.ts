import * as R from 'remeda'
import { DATA_SOURCE, GOAL_TYPE, LIVE_EVENT_TYPE, SIDE, type LivePlayerVM, type SeasonNumbersVM, type Side } from '@/modules/matches/client'
import type { LiveEvent, PlayerMatchState } from './live-state'

const PREFERRED_FIRST_SELECTION_SHIRT = 9

const EMPTY_MATCH_STATE: PlayerMatchState = {
  onPitch: false,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  sentOff: false,
  sentOffBySecondYellow: false,
  subbedIn: false,
  subbedOut: false,
}

type PlayerStates = Record<string, PlayerMatchState>

const updatePlayer = (states: PlayerStates, playerId: string | null, change: (state: PlayerMatchState) => Partial<PlayerMatchState>): PlayerStates => {
  const current = playerId ? states[playerId] : undefined
  if (!playerId || !current) return states

  return { ...states, [playerId]: { ...current, ...change(current) } }
}

const applyGoal = (states: PlayerStates, event: LiveEvent): PlayerStates => {
  const withScorer = event.goalType === GOAL_TYPE.OWN_GOAL ? states : updatePlayer(states, event.playerId, (state) => ({ goals: state.goals + 1 }))

  return updatePlayer(withScorer, event.assistPlayerId, (state) => ({ assists: state.assists + 1 }))
}

const applySubstitution = (states: PlayerStates, event: LiveEvent): PlayerStates => {
  const pitchChange = (onPitch: boolean) => (event.appliedToLineup ? {} : { onPitch })
  const withOut = updatePlayer(states, event.playerOutId, () => ({ subbedOut: true, ...pitchChange(false) }))

  return updatePlayer(withOut, event.playerId, () => ({ subbedIn: true, ...pitchChange(true) }))
}

const applyEvent = (states: PlayerStates, event: LiveEvent): PlayerStates => {
  if (event.type === LIVE_EVENT_TYPE.GOAL) return applyGoal(states, event)
  if (event.type === LIVE_EVENT_TYPE.YELLOW_CARD) return updatePlayer(states, event.playerId, (state) => ({ yellowCards: state.yellowCards + 1 }))
  if (event.type === LIVE_EVENT_TYPE.RED_CARD) return updatePlayer(states, event.playerId, () => ({ sentOff: true, sentOffBySecondYellow: event.fromSecondYellow }))

  return applySubstitution(states, event)
}

export const derivePlayerStates = (players: LivePlayerVM[], events: LiveEvent[]): PlayerStates =>
  events.reduce(applyEvent, R.fromEntries(players.map((player) => [player.playerId, { ...EMPTY_MATCH_STATE, onPitch: player.isStarter }] as const)))

export const selectScore = (events: LiveEvent[]): Record<Side, number> => {
  const goalsBySide = R.countBy(
    events.filter((event) => event.type === LIVE_EVENT_TYPE.GOAL),
    (event) => event.side,
  )

  return { [SIDE.HOME]: goalsBySide[SIDE.HOME] ?? 0, [SIDE.AWAY]: goalsBySide[SIDE.AWAY] ?? 0 }
}

export const findLatestOpenGoal = (events: LiveEvent[], side: Side): LiveEvent | undefined =>
  R.findLast(events, (event) => event.type === LIVE_EVENT_TYPE.GOAL && event.side === side && event.assistPlayerId === null)

export const playerTag = (player: LivePlayerVM | undefined): string => (player ? `#${player.shirtNumber} ${player.shortName}` : 'Comissão técnica')

export const pickInitialSelection = (players: LivePlayerVM[], states: PlayerStates): string | null => {
  const onPitch = players.filter((player) => states[player.playerId]?.onPitch)
  const preferred = onPitch.find((player) => player.side === SIDE.HOME && player.shirtNumber === PREFERRED_FIRST_SELECTION_SHIRT)

  return (preferred ?? onPitch[0])?.playerId ?? null
}

const isLiveSource = (event: LiveEvent): boolean => event.source !== DATA_SOURCE.FMF

export const seasonNumbersWithMatch = (player: LivePlayerVM, events: LiveEvent[]): SeasonNumbersVM => {
  const liveEvents = events.filter(isLiveSource)
  const liveStates = derivePlayerStates([player], liveEvents)[player.playerId]

  return {
    goals: player.season.goals + (liveStates?.goals ?? 0),
    assists: player.season.assists + (liveStates?.assists ?? 0),
    yellowCards: player.season.yellowCards + (liveStates?.yellowCards ?? 0),
    games: player.season.games + (liveStates?.subbedIn ? 1 : 0),
  }
}

export const DIRECTION = { UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right' } as const

export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION]

type PlacedPlayer = { playerId: string; x: number; y: number }

const SECONDARY_AXIS_WEIGHT = 2

const directionalDistance = (from: PlacedPlayer, to: PlacedPlayer, direction: Direction): number | null => {
  const horizontal = direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
  const sign = direction === DIRECTION.RIGHT || direction === DIRECTION.DOWN ? 1 : -1
  const primary = (horizontal ? to.x - from.x : to.y - from.y) * sign
  const secondary = Math.abs(horizontal ? to.y - from.y : to.x - from.x)

  return primary > 0 ? primary + secondary * SECONDARY_AXIS_WEIGHT : null
}

export const nextPlayerInDirection = (placed: PlacedPlayer[], fromPlayerId: string | null, direction: Direction): string | null => {
  const origin = placed.find((player) => player.playerId === fromPlayerId)
  if (!origin) return placed[0]?.playerId ?? null

  const candidates = placed.flatMap((player) => {
    const distance = player.playerId === origin.playerId ? null : directionalDistance(origin, player, direction)

    return distance === null ? [] : [{ playerId: player.playerId, distance }]
  })

  return R.firstBy(candidates, (candidate) => candidate.distance)?.playerId ?? origin.playerId
}
