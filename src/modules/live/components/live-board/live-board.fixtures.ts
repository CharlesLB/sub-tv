import { GOAL_TYPE, INITIAL_LIVE_CLOCK, LIVE_EVENT_TYPE, type LiveClock, type LiveMatchSnapshot, MATCH_PERIOD, MATCH_STATUS, PLAYER_POSITION, PREFERRED_FOOT, SIDE } from '@/modules/matches/client'
import { makeEvent, makePlayer, makeSnapshot, PLAYER } from '../../state/live-state.fixtures'
import { type OfficialsStripItem, officialsStripItems } from '../officials-strip/officials-strip-items'

export const KICKOFF_AT = '2026-09-19T13:00:00.000Z'

export const homeStrikerFixture = makePlayer({
  playerId: PLAYER.HOME_STRIKER,
  side: SIDE.HOME,
  shirtNumber: 9,
  name: 'Davi Moreira',
  shortName: 'Davi',
  nickname: 'Davizinho',
  position: PLAYER_POSITION.FORWARD,
  preferredFoot: PREFERRED_FOOT.RIGHT,
  pitchPoint: { x: 44, y: 50 },
  season: { goals: 6, assists: 2, yellowCards: 1, games: 8 },
  curiosities: ['Artilheiro do time na última temporada'],
})

export const homeMidfielderFixture = makePlayer({
  playerId: PLAYER.HOME_MIDFIELDER,
  side: SIDE.HOME,
  shirtNumber: 10,
  name: 'Heitor Lacerda',
  shortName: 'Heitor',
  position: PLAYER_POSITION.MIDFIELDER,
  pitchPoint: { x: 32, y: 30 },
})

export const homeReserveFixture = makePlayer({
  playerId: PLAYER.HOME_RESERVE,
  side: SIDE.HOME,
  shirtNumber: 12,
  name: 'Caio Brandão',
  shortName: 'Caio',
  isStarter: false,
  pitchPoint: null,
})

export const awayStrikerFixture = makePlayer({
  playerId: PLAYER.AWAY_STRIKER,
  side: SIDE.AWAY,
  shirtNumber: 9,
  name: 'Otávio Siqueira',
  shortName: 'Otávio',
  position: PLAYER_POSITION.FORWARD,
  pitchPoint: { x: 56, y: 50 },
})

export const awayReserveFixture = makePlayer({
  playerId: PLAYER.AWAY_RESERVE,
  side: SIDE.AWAY,
  shirtNumber: 12,
  name: 'Bento Arruda',
  shortName: 'Bento',
  isStarter: false,
  pitchPoint: null,
})

export const liveSnapshotFixture: LiveMatchSnapshot = makeSnapshot({
  officials: [{ label: 'Árbitro', name: 'Renato Pires' }],
  players: [homeStrikerFixture, homeMidfielderFixture, homeReserveFixture, awayStrikerFixture, awayReserveFixture],
})

export const officialsItemsFixture: OfficialsStripItem[] = officialsStripItems(liveSnapshotFixture)

export const runningFirstHalfClockFixture: LiveClock = { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FIRST_HALF, running: true, startedAt: KICKOFF_AT }

export const liveSnapshotWithEventsFixture: LiveMatchSnapshot = {
  ...liveSnapshotFixture,
  status: MATCH_STATUS.LIVE,
  clock: runningFirstHalfClockFixture,
  events: [
    makeEvent({ key: 'goal-home-9', type: LIVE_EVENT_TYPE.GOAL, side: SIDE.HOME, minute: 12, playerId: PLAYER.HOME_STRIKER, assistPlayerId: PLAYER.HOME_MIDFIELDER, goalType: GOAL_TYPE.NORMAL }),
    makeEvent({ key: 'yellow-away-9', type: LIVE_EVENT_TYPE.YELLOW_CARD, side: SIDE.AWAY, minute: 20, playerId: PLAYER.AWAY_STRIKER }),
  ],
}

export class SilentEventSource extends EventTarget {
  readonly close = (): void => undefined
}

export const homeTeamFixture = liveSnapshotFixture.teams[SIDE.HOME]

export const awayTeamFixture = liveSnapshotFixture.teams[SIDE.AWAY]

const EVENT_SOURCE_GLOBAL = 'EventSource'

export const silenceLiveStream = (): (() => void) => {
  const originalEventSource = Object.getOwnPropertyDescriptor(globalThis, EVENT_SOURCE_GLOBAL)
  Object.defineProperty(globalThis, EVENT_SOURCE_GLOBAL, { value: SilentEventSource, configurable: true, writable: true })

  return () => {
    if (originalEventSource) Object.defineProperty(globalThis, EVENT_SOURCE_GLOBAL, originalEventSource)
    else Reflect.deleteProperty(globalThis, EVENT_SOURCE_GLOBAL)
  }
}
