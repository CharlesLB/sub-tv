import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { playerSeasonStats } from '@/lib/db/schema'
import { seedEvent, seedMatch, seedSeason } from '@/test/database-seeds/database-seeds'
import { recomputeSeasonStatistics } from './season-statistics'

const statisticsOf = async (playerId: string) => (await db.select().from(playerSeasonStats).where(eq(playerSeasonStats.playerId, playerId)))[0]

describe('recomputeSeasonStatistics', () => {
  it('counts games and goals of finished matches', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'encerrado', 1)
    await seedEvent(matchId, 'gol', season.homePlayerId)

    await recomputeSeasonStatistics(db, season.seasonId)

    expect(await statisticsOf(season.homePlayerId)).toMatchObject({ games: 1, starts: 1, goals: 1 })
  })

  it('ignores lineups and goals of matches that are scheduled or still live', async () => {
    const season = await seedSeason()
    await seedEvent(await seedMatch(season, 'encerrado', 1), 'gol', season.homePlayerId)
    await seedEvent(await seedMatch(season, 'ao_vivo', 2), 'gol', season.homePlayerId)
    await seedMatch(season, 'agendado', 3)

    await recomputeSeasonStatistics(db, season.seasonId)

    expect(await statisticsOf(season.homePlayerId)).toMatchObject({ games: 1, starts: 1, goals: 1 })
  })
})
