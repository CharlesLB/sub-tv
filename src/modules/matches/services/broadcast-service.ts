import 'server-only'
import { eq } from 'drizzle-orm'
import { db, tables } from '@/lib/db'

export const broadcastService = {
  close: async (matchId: string): Promise<{ seasonId: string } | null> => {
    const [match] = await db
      .update(tables.matches)
      .set({ isBroadcast: false })
      .where(eq(tables.matches.id, matchId))
      .returning({ seasonId: tables.matches.seasonId })

    return match ?? null
  },
}
