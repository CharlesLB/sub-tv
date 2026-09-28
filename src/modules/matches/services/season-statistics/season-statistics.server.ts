import 'server-only'
import { db } from '@/lib/db'
import { recomputeSeasonStatistics } from './season-statistics'

export const recalculateSeasonStatistics = async (seasonId: string): Promise<void> =>
  await db.transaction(async (transaction) => {
    await recomputeSeasonStatistics(transaction, seasonId)
  })
