import { AUDIT_ACTION, AUDIT_ENTITY } from '../../lib/audit-action/audit-action'
import { AUDIT_PERIOD, type AuditFilter } from '../../lib/audit-filter/audit-filter'
import type { AuditUserOptionVM } from '../../types'

export const auditUserOptionsFixture: AuditUserOptionVM[] = [
  { id: '3b1f6a2e-5c4d-4e8f-9a1b-2c3d4e5f6a70', username: 'Marina Couto' },
  { id: '7c2e9b41-8d3a-4f6b-a5c1-0e9d8c7b6a51', username: 'Otávio Prado' },
]

export const emptyAuditFilterFixture: AuditFilter = {
  userId: null,
  action: null,
  entityType: null,
  period: AUDIT_PERIOD.ALL,
  page: 1,
}

export const selectedAuditFilterFixture: AuditFilter = {
  userId: '7c2e9b41-8d3a-4f6b-a5c1-0e9d8c7b6a51',
  action: AUDIT_ACTION.PLAYER_PROFILE_UPDATED,
  entityType: AUDIT_ENTITY.PLAYER,
  period: AUDIT_PERIOD.WEEK,
  page: 1,
}
