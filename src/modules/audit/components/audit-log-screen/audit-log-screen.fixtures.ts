import type { AuditPageVM } from '../../types'
import { auditRowsFixture } from '../audit-table/audit-table.fixtures'

export const auditPageFixture: AuditPageVM = { rows: auditRowsFixture, page: 1, hasNextPage: true }

export const emptyAuditPageFixture: AuditPageVM = { rows: [], page: 1, hasNextPage: false }
