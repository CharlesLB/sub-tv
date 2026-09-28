import 'server-only'
import { db, tables } from '@/lib/db'
import type { AuditAction, AuditEntity } from '../audit-action'

export type AuditEntry = {
  userId: string
  action: AuditAction
  entityType: AuditEntity
  entityId: string | null
  details?: Record<string, unknown>
}

export const recordAudit = async (entry: AuditEntry): Promise<void> => {
  await db.insert(tables.auditLog).values({
    userId: entry.userId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    details: entry.details ?? null,
  })
}
