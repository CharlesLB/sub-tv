import 'server-only'
import { asc } from 'drizzle-orm'
import { connection } from 'next/server'
import { db, tables } from '@/lib/db'
import type { AuditUserOptionVM } from '../types'

export const getAuditUserOptions = async (): Promise<AuditUserOptionVM[]> => {
  await connection()
  const { appUsers } = tables

  return db.select({ id: appUsers.id, username: appUsers.username }).from(appUsers).orderBy(asc(appUsers.normalizedUsername))
}
