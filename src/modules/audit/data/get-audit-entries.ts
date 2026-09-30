import 'server-only'
import { and, desc, eq, gte, type SQL } from 'drizzle-orm'
import { connection } from 'next/server'
import { db, tables } from '@/lib/db'
import { type AuditFilter, periodStart } from '../lib/audit-filter/audit-filter'
import { AUDIT_ENTITY_LABEL, actionLabelOf, isAuditEntity } from '../lib/audit-labels/audit-labels'
import { nameFromDetails, summarizeDetails } from '../lib/details-summary/details-summary'
import type { AuditPageVM } from '../types'
import { resolveEntityDescriptions } from './resolve-entities'

export const AUDIT_PAGE_SIZE = 50

const filterConditions = (filter: AuditFilter, now: Date): SQL[] => {
  const { auditLog } = tables
  const since = periodStart(filter.period, now)

  return [
    ...(filter.userId ? [eq(auditLog.userId, filter.userId)] : []),
    ...(filter.action ? [eq(auditLog.action, filter.action)] : []),
    ...(filter.entityType ? [eq(auditLog.entityType, filter.entityType)] : []),
    ...(since ? [gte(auditLog.createdAt, since)] : []),
  ]
}

export const getAuditEntries = async (filter: AuditFilter): Promise<AuditPageVM> => {
  await connection()
  const { auditLog, appUsers } = tables

  const rows = await db
    .select({
      id: auditLog.id,
      createdAt: auditLog.createdAt,
      userName: appUsers.username,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      details: auditLog.details,
    })
    .from(auditLog)
    .innerJoin(appUsers, eq(appUsers.id, auditLog.userId))
    .where(and(...filterConditions(filter, new Date())))
    .orderBy(desc(auditLog.createdAt), desc(auditLog.id))
    .limit(AUDIT_PAGE_SIZE + 1)
    .offset((filter.page - 1) * AUDIT_PAGE_SIZE)

  const pageRows = rows.slice(0, AUDIT_PAGE_SIZE)
  const descriptions = await resolveEntityDescriptions(pageRows)

  return {
    page: filter.page,
    hasNextPage: rows.length > AUDIT_PAGE_SIZE,
    rows: pageRows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      userName: row.userName,
      action: row.action,
      actionLabel: actionLabelOf(row.action),
      entityLabel: isAuditEntity(row.entityType) ? AUDIT_ENTITY_LABEL[row.entityType] : row.entityType,
      entityDescription: (row.entityId ? descriptions[row.entityId] : undefined) ?? nameFromDetails(row.details),
      detailsSummary: summarizeDetails(row.details),
    })),
  }
}
