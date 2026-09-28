import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { matchEvents, playerSeasonStats } from '@/lib/db/schema'
import { recomputeSeasonStatistics } from './season-statistics'
import { seedEvent, seedMatch, seedSeason } from '@/test/database-seeds/database-seeds'

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

  it('adds substitutions, assists, cards, penalty goals and own goals of each player', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'encerrado', 1)
    const event = { matchId, side: 'home' as const, period: '2T' as const, minute: 30, source: 'ao_vivo' as const }

    await db.insert(matchEvents).values([
      { ...event, type: 'substituicao', playerId: season.homeBenchPlayerId, playerOutId: season.homePlayerId },
      { ...event, type: 'gol', goalType: 'penalti', playerId: season.homeBenchPlayerId, assistPlayerId: season.homePlayerId },
      { ...event, type: 'gol', goalType: 'contra', playerId: season.homeBenchPlayerId },
      { ...event, type: 'gol', goalType: 'normal', period: 'PEN', playerId: season.homeBenchPlayerId },
      { ...event, type: 'amarelo', playerId: season.homeBenchPlayerId },
      { ...event, type: 'vermelho', playerId: season.homePlayerId },
      { ...event, type: 'amarelo', playerId: season.homeBenchPlayerId, deletedAt: new Date() },
    ])

    await recomputeSeasonStatistics(db, season.seasonId)

    expect(await statisticsOf(season.homeBenchPlayerId)).toMatchObject({ games: 1, starts: 0, subIn: 1, subOut: 0, goals: 1, penaltyGoals: 1, ownGoals: 1, assists: 0, yellowCards: 1, redCards: 0 })
    expect(await statisticsOf(season.homePlayerId)).toMatchObject({ games: 1, starts: 1, subIn: 0, subOut: 1, goals: 0, assists: 1, yellowCards: 0, redCards: 1 })
  })
})
