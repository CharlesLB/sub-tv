import { CREST_IMAGE_PATH } from '@/components/ui/crest/crest.fixtures'
import { SIDE } from '@/modules/matches/client'
import { makeSnapshot } from '../../state/live-state.fixtures'

export const liveTeamsFixture = makeSnapshot().teams

export const homeTeamFixture = liveTeamsFixture[SIDE.HOME]

export const awayTeamFixture = liveTeamsFixture[SIDE.AWAY]

export const homeTeamWithCrestFixture = { ...homeTeamFixture, crestPath: CREST_IMAGE_PATH }
