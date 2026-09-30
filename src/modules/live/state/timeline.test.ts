import * as R from 'remeda'
import { describe, expect, it, vi } from 'vitest'
import { INITIAL_LIVE_CLOCK, LIVE_EVENT_TYPE, MATCH_PERIOD, SIDE } from '@/modules/matches/client'
import { SYNC_STATE } from './live-state'
import { makeEvent, makeSnapshot, PLAYER } from './live-state.fixtures'
import { buildTimeline, describeEvent, TIMELINE_MARKER } from './timeline'

vi.mock('@/modules/matches/client', async () => ({
  ...(await vi.importActual('@/modules/matches/lib/live-match/live-match')),
  ...(await vi.importActual('@/modules/matches/lib/live-clock/live-clock')),
  ...(await vi.importActual('@/modules/matches/lib/pitch-layout/pitch-layout')),
}))

const snapshot = makeSnapshot()
const playersById = R.indexBy(snapshot.players, (player) => player.playerId)
const confirmed = (event: ReturnType<typeof makeEvent>) => ({ ...event, syncState: SYNC_STATE.CONFIRMED })

describe('timeline', () => {
  it('goal with assist describes scorer and assistant', () => {
    const goal = confirmed(makeEvent({ key: 'g', type: LIVE_EVENT_TYPE.GOAL, side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER, assistPlayerId: PLAYER.HOME_MIDFIELDER }))

    expect(describeEvent(goal, playersById)).toBe('GOL — #9 Atleta9 · ASSIST. #10 Atleta10')
  })

  it('substitution names the shirts leaving and entering', () => {
    const substitution = confirmed(makeEvent({ key: 's', type: LIVE_EVENT_TYPE.SUBSTITUTION, side: SIDE.HOME, playerId: PLAYER.HOME_RESERVE, playerOutId: PLAYER.HOME_STRIKER }))

    expect(describeEvent(substitution, playersById)).toBe('SUBSTITUIÇÃO — SAI #9 · ENTRA #12')
  })

  it('half time marker sits between first and second half events', () => {
    const events = [
      confirmed(makeEvent({ key: 'first', type: LIVE_EVENT_TYPE.YELLOW_CARD, side: SIDE.AWAY, playerId: PLAYER.AWAY_STRIKER })),
      confirmed(makeEvent({ key: 'second', type: LIVE_EVENT_TYPE.GOAL, side: SIDE.HOME, playerId: PLAYER.HOME_STRIKER, period: MATCH_PERIOD.SECOND_HALF, minute: 3 })),
    ]

    const timeline = buildTimeline(events, { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.SECOND_HALF, firstHalfMinutes: 35 }, playersById)

    expect(timeline.map((item) => item.key)).toEqual(['first', TIMELINE_MARKER.HALF_TIME, 'second'])
    expect(timeline[2]?.minuteLabel).toBe("2ºT 3'")
  })
})
