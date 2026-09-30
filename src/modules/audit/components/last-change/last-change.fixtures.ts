import { AUDIT_ACTION } from '../../lib/audit-action/audit-action'
import { AUDIT_ACTION_LABEL } from '../../lib/audit-labels/audit-labels'
import type { LastChangeVM } from '../../types'

export const lastChangeFixture: LastChangeVM = {
  userName: 'Marina Couto',
  createdAt: '2026-09-20T13:05:00.000Z',
  actionLabel: AUDIT_ACTION_LABEL[AUDIT_ACTION.PLAYER_PROFILE_UPDATED],
}
