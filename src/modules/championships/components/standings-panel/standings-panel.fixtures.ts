import type { StandingPhaseVM } from '../../types'
import { FIRST_PHASE_FIXTURE } from '../match-card/match-card.fixtures'
import { SECOND_PHASE_FIXTURE } from '../round-panel/round-panel.fixtures'
import { bottomRowFixture, leaderRowFixture, middleRowFixture } from '../standings-row/standings-row.fixtures'
import { namedGroupFixture, singleGroupFixture } from '../standings-table/standings-table.fixtures'

export const JOINT_PHASE_FIXTURE = 'CONJUNTA SUB-13 + SUB-14'

export const singlePhaseFixture: StandingPhaseVM[] = [{ phase: FIRST_PHASE_FIXTURE, groups: [singleGroupFixture] }]

export const multiplePhasesFixture: StandingPhaseVM[] = [
  { phase: SECOND_PHASE_FIXTURE, groups: [namedGroupFixture, { groupName: 'B', rows: [leaderRowFixture, middleRowFixture, bottomRowFixture] }] },
  { phase: JOINT_PHASE_FIXTURE, groups: [singleGroupFixture] },
]
