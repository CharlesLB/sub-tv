import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { matchEvents } from '@/lib/db/schema'
import { reconcileLiveEvents } from './live-reconciliation'
import { seedMatch, seedSeason } from '@/test/database-seeds/database-seeds'

const insertGoal = async (goal: { matchId: string; playerId: string; minute: number; source: 'fmf' | 'ao_vivo'; assistPlayerId: string | null }): Promise<string> => {
  const [row] = await db
    .insert(matchEvents)
    .values({ ...goal, side: 'home', type: 'gol', period: '1T', goalType: 'normal' })
    .returning({ id: matchEvents.id })

  if (!row) throw new Error('insert returned no row')

  return row.id
}

const eventById = async (eventId: string) => (await db.select().from(matchEvents).where(eq(matchEvents.id, eventId)))[0]

describe('reconcileLiveEvents', () => {
  it('copies the assist recorded live onto the paired súmula goal, which carries no assist', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'encerrado', 1)
    const liveGoalId = await insertGoal({ matchId, playerId: season.homePlayerId, minute: 12, source: 'ao_vivo', assistPlayerId: season.homeBenchPlayerId })
    const fmfGoalId = await insertGoal({ matchId, playerId: season.homePlayerId, minute: 13, source: 'fmf', assistPlayerId: null })

    await db.transaction(async (transaction) => await reconcileLiveEvents(transaction, [matchId]))

    expect(await eventById(fmfGoalId)).toMatchObject({ assistPlayerId: season.homeBenchPlayerId })
    expect(await eventById(liveGoalId)).toMatchObject({ reconciledWithId: fmfGoalId })
  })

  it('keeps an assist the súmula goal already has', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'encerrado', 1)
    await insertGoal({ matchId, playerId: season.homePlayerId, minute: 12, source: 'ao_vivo', assistPlayerId: season.homeBenchPlayerId })
    const fmfGoalId = await insertGoal({ matchId, playerId: season.homePlayerId, minute: 12, source: 'fmf', assistPlayerId: season.awayPlayerId })

    await db.transaction(async (transaction) => await reconcileLiveEvents(transaction, [matchId]))

    expect(await eventById(fmfGoalId)).toMatchObject({ assistPlayerId: season.awayPlayerId })
  })
})
