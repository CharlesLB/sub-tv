import 'server-only'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db, tables } from '@/lib/db'
import { normalizeUsername } from '../lib/normalize-username/normalize-username'

const TIMING_GUARD_HASH = '$2b$12$7DU6UflHC6tx3vnkGIKGGuG/yIZ.rZH.nGq0mKSxRAFG46Mmlaa8C'

export type AppUser = { id: string; username: string }

export const userService = {
  authenticate: async (username: string, password: string): Promise<AppUser | null> => {
    const { appUsers } = tables

    const [user] = await db
      .select({ id: appUsers.id, username: appUsers.username, passwordHash: appUsers.passwordHash, isActive: appUsers.isActive })
      .from(appUsers)
      .where(eq(appUsers.normalizedUsername, normalizeUsername(username)))
      .limit(1)

    const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? TIMING_GUARD_HASH)
    if (!user?.isActive || !passwordMatches) return null

    await db.update(appUsers).set({ lastSignInAt: new Date() }).where(eq(appUsers.id, user.id))

    return { id: user.id, username: user.username }
  },
  findActiveById: async (userId: string): Promise<AppUser | null> => {
    const { appUsers } = tables
    const [user] = await db.select({ id: appUsers.id, username: appUsers.username, isActive: appUsers.isActive }).from(appUsers).where(eq(appUsers.id, userId)).limit(1)

    return user?.isActive ? { id: user.id, username: user.username } : null
  },
}
