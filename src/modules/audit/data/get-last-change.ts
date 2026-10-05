import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import type { AuditEntity } from '../lib/audit-action/audit-action'
import { actionLabelOf } from '../lib/audit-labels/audit-labels'
import type { LastChangeVM } from '../types'

export const getLastChange = async (entityType: AuditEntity, entityId: string): Promise<LastChangeVM | null> => {
  'use cache'
  cacheLife('minutes')
  cacheTag(tags.player(entityId))

  const { auditLog, appUsers } = tables

  const [row] = await db
    .select({ userName: appUsers.username, createdAt: auditLog.createdAt, action: auditLog.action })
    .from(auditLog)
    .innerJoin(appUsers, eq(appUsers.id, auditLog.userId))
    .where(and(eq(auditLog.entityType, entityType), eq(auditLog.entityId, entityId)))
    .orderBy(desc(auditLog.createdAt))
    .limit(1)

  return row ? { userName: row.userName, createdAt: row.createdAt.toISOString(), actionLabel: actionLabelOf(row.action) } : null
}
