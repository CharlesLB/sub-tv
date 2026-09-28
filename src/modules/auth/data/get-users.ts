import 'server-only'
import { asc } from 'drizzle-orm'
import { connection } from 'next/server'
import { db, tables } from '@/lib/db'

export type UserRowVM = { id: string; username: string; isActive: boolean; lastSignInAt: string | null }

export const getUsers = async (): Promise<UserRowVM[]> => {
  await connection()
  const { appUsers } = tables

  const rows = await db
    .select({ id: appUsers.id, username: appUsers.username, isActive: appUsers.isActive, lastSignInAt: appUsers.lastSignInAt })
    .from(appUsers)
    .orderBy(asc(appUsers.normalizedUsername))

  return rows.map((row) => ({ ...row, lastSignInAt: row.lastSignInAt?.toISOString() ?? null }))
}
