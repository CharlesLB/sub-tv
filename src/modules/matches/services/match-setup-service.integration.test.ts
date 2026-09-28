import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { seasonSquads } from '@/lib/db/schema'
import { matchSetupService } from './match-setup-service'
import { type SeededSeason, seedSeason } from '@/test/database-seeds/database-seeds'

const enrollSquads = async (season: SeededSeason, sharedPlayerId: string) => {
  await db.insert(seasonSquads).values([
    { seasonTeamId: season.homeTeamId, playerId: season.homePlayerId, usualShirtNumber: 10 },
    { seasonTeamId: season.homeTeamId, playerId: sharedPlayerId, usualShirtNumber: 17 },
    { seasonTeamId: season.awayTeamId, playerId: season.awayPlayerId, usualShirtNumber: 9 },
    { seasonTeamId: season.awayTeamId, playerId: sharedPlayerId, usualShirtNumber: 7 },
  ])
}

const broadcastInput = (season: SeededSeason, awayStarterIds: string[]) => ({
  seasonId: season.seasonId,
  kickoffDate: '2026-09-19',
  kickoffTime: '10:00',
  round: 7,
  venue: 'Estádio Municipal',
  homeSeasonTeamId: season.homeTeamId,
  awaySeasonTeamId: season.awayTeamId,
  homeStarterIds: [season.homePlayerId],
  awayStarterIds,
  homeStarterPositions: undefined,
  awayStarterPositions: undefined,
})

describe('matchSetupService.createBroadcastMatch', () => {
  it('saves a lineup whose starters belong to their own squads', async () => {
    const season = await seedSeason()
    await enrollSquads(season, season.homeBenchPlayerId)

    const result = await matchSetupService.createBroadcastMatch(broadcastInput(season, [season.awayPlayerId]))

    expect(result.ok).toBe(true)
  })

  it('refuses an away starter who is also enrolled in the home squad', async () => {
    const season = await seedSeason()
    await enrollSquads(season, season.homeBenchPlayerId)

    const result = await matchSetupService.createBroadcastMatch(broadcastInput(season, [season.awayPlayerId, season.homeBenchPlayerId]))

    expect(result.ok).toBe(false)
  })
})
