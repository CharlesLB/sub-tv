import { SIDE } from '@/modules/matches/client'
import { makeSnapshot } from '../../state/live-state.fixtures'

export const liveTeamsFixture = makeSnapshot().teams

export const homeTeamFixture = liveTeamsFixture[SIDE.HOME]

export const awayTeamFixture = liveTeamsFixture[SIDE.AWAY]
