import * as R from 'remeda'
import type { MatchCardVM } from '../../types'
import { finishedMatchFixture, liveMatchFixture, penaltiesMatchFixture, scheduledMatchFixture } from '../match-card/match-card.fixtures'

const CROWDED_ROUND_SIZE = 10

export const SECOND_PHASE_FIXTURE = '2ª FASE'

export const otherPhaseRoundThreeMatchFixture: MatchCardVM = { ...finishedMatchFixture, id: '9a8b7c6d-7777-4e2f-8a3b-4c5d6e7f8a07', phase: SECOND_PHASE_FIXTURE }

export const seasonMatchesFixture: MatchCardVM[] = [finishedMatchFixture, penaltiesMatchFixture, liveMatchFixture, scheduledMatchFixture, otherPhaseRoundThreeMatchFixture]

export const crowdedRoundMatchesFixture: MatchCardVM[] = R.range(0, CROWDED_ROUND_SIZE).map((index) => ({
  ...finishedMatchFixture,
  id: `9a8b7c6d-8888-4e2f-8a3b-4c5d6e7f8a${String(index).padStart(2, '0')}`,
}))
