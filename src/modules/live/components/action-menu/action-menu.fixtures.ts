import { LIVE_EVENT_TYPE, type LiveMatchSnapshot, SIDE } from '@/modules/matches/client'
import type { MenuState } from '../../interaction/interaction-state'
import type { PlayerMatchState } from '../../state/live-state'
import { makeEvent, PLAYER } from '../../state/live-state.fixtures'
import { starterMatchStateFixture } from '../bench-dot/bench-dot.fixtures'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'

export const strikerMenuFixture: MenuState = { playerId: PLAYER.HOME_STRIKER, anchor: { x: 300, top: 200, bottom: 240 } }

export const midfielderMenuFixture: MenuState = { ...strikerMenuFixture, playerId: PLAYER.HOME_MIDFIELDER }

export const strikerWithNumbersFixture: PlayerMatchState = { ...starterMatchStateFixture, goals: 2, assists: 1, yellowCards: 1 }

export const sentOffStrikerFixture: PlayerMatchState = { ...starterMatchStateFixture, yellowCards: 2, sentOff: true, sentOffBySecondYellow: true }

export const snapshotWithOpenGoalFixture: LiveMatchSnapshot = {
  ...liveSnapshotFixture,
  events: [makeEvent({ key: 'goal-home-9', type: LIVE_EVENT_TYPE.GOAL, side: SIDE.HOME, minute: 12, playerId: PLAYER.HOME_STRIKER })],
}
