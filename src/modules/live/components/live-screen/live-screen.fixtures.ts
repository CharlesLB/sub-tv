import { LIVE_EVENT_TYPE, MATCH_PERIOD, SIDE } from '@/modules/matches/client'
import { makeEvent, makeSnapshot, PLAYER } from '../../state/live-state.fixtures'
import { livePlayersFixture } from '../player-dot/player-dot.fixtures'

export const liveSnapshotFixture = makeSnapshot({
  players: livePlayersFixture,
  officials: [
    { label: 'Árbitro', name: 'Rogério Tavares' },
    { label: 'Assistente 1', name: 'Marcela Duarte' },
  ],
  events: [
    makeEvent({ key: 'goal-home-9', type: LIVE_EVENT_TYPE.GOAL, side: SIDE.HOME, minute: 12, playerId: PLAYER.HOME_STRIKER, assistPlayerId: PLAYER.HOME_MIDFIELDER }),
    makeEvent({ key: 'yellow-away-9', type: LIVE_EVENT_TYPE.YELLOW_CARD, side: SIDE.AWAY, period: MATCH_PERIOD.FIRST_HALF, minute: 20, playerId: PLAYER.AWAY_STRIKER }),
  ],
})

export const emptyLiveSnapshotFixture = makeSnapshot({ players: livePlayersFixture })

export class SilentEventSource extends EventTarget {
  close = (): void => undefined
}
