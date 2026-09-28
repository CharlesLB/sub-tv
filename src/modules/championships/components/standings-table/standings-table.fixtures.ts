import type { StandingGroupVM } from '../../types'
import { standingRowsFixture } from '../standings-row/standings-row.fixtures'

export const namedGroupFixture: StandingGroupVM = { groupName: 'A', rows: standingRowsFixture }

export const singleGroupFixture: StandingGroupVM = { groupName: null, rows: standingRowsFixture }
