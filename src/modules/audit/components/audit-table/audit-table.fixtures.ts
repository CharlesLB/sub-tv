import { AUDIT_ACTION, AUDIT_ENTITY } from '../../lib/audit-action/audit-action'
import { AUDIT_ACTION_LABEL, AUDIT_ENTITY_LABEL } from '../../lib/audit-labels/audit-labels'
import type { AuditRowVM } from '../../types'

export const playerProfileChangeRowFixture: AuditRowVM = {
  id: '0d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b10',
  createdAt: '2026-09-20T13:05:00.000Z',
  userName: 'Marina Couto',
  action: AUDIT_ACTION.PLAYER_PROFILE_UPDATED,
  actionLabel: AUDIT_ACTION_LABEL[AUDIT_ACTION.PLAYER_PROFILE_UPDATED],
  entityLabel: AUDIT_ENTITY_LABEL[AUDIT_ENTITY.PLAYER],
  entityDescription: 'Caio Mendes (Caiozinho)',
  detailsSummary: 'Apelido, posição',
}

export const signInRowFixture: AuditRowVM = {
  id: '1e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c21',
  createdAt: '2026-09-20T12:58:00.000Z',
  userName: 'Otávio Prado',
  action: AUDIT_ACTION.SIGN_IN,
  actionLabel: AUDIT_ACTION_LABEL[AUDIT_ACTION.SIGN_IN],
  entityLabel: null,
  entityDescription: null,
  detailsSummary: '',
}

export const auditRowsFixture: AuditRowVM[] = [playerProfileChangeRowFixture, signInRowFixture]
