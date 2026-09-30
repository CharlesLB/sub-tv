import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { matchEvents, matches, matchLineups, teamSeasonStats } from '@/lib/db/schema'
import type { LiveClock } from '../lib/live-match/live-match'
import { liveService } from './live-service'
import { seedEvent, seedMatch, seedSeason } from '@/test/database-seeds/database-seeds'

const OPERATOR = 'operador-teste'

const clockAt = (period: LiveClock['period']): LiveClock => ({ period, running: false, startedAt: null, elapsedSeconds: 0, addedMinutes: 0, firstHalfMinutes: null, secondHalfMinutes: null })

const goalOf = (matchId: string, playerId: string, clientId: string) => ({
  matchId,
  clientId,
  type: 'gol' as const,
  side: 'home' as const,
  period: '1T' as const,
  minute: 12,
  playerId,
  fromSecondYellow: false,
})

const isStarter = async (matchId: string, playerId: string) =>
  (
    await db
      .select({ isStarter: matchLineups.isStarter })
      .from(matchLineups)
      .where(and(eq(matchLineups.matchId, matchId), eq(matchLineups.playerId, playerId)))
  )[0]?.isStarter

describe('liveService.recordEvent', () => {
  it('reports a retried event with the same client id as not created and keeps a single row', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'ao_vivo', 1)
    const clientId = randomUUID()

    const first = await liveService.recordEvent(goalOf(matchId, season.homePlayerId, clientId), OPERATOR)
    const retry = await liveService.recordEvent(goalOf(matchId, season.homePlayerId, clientId), OPERATOR)

    expect(first.result).toMatchObject({ ok: true, data: { created: true } })
    expect(retry.result).toMatchObject({ ok: true, data: { created: false } })
    expect(await db.select().from(matchEvents).where(eq(matchEvents.matchId, matchId))).toHaveLength(1)
  })

  it('refuses a client id that already belongs to another match', async () => {
    const season = await seedSeason()
    const firstMatchId = await seedMatch(season, 'ao_vivo', 1)
    const secondMatchId = await seedMatch(season, 'ao_vivo', 2)
    const clientId = randomUUID()
    await liveService.recordEvent(goalOf(firstMatchId, season.homePlayerId, clientId), OPERATOR)

    const reused = await liveService.recordEvent(goalOf(secondMatchId, season.homePlayerId, clientId), OPERATOR)

    expect(reused.result.ok).toBe(false)
  })
})

describe('liveService.substitute', () => {
  const substitutionOf = (matchId: string, playerInId: string, playerOutId: string) => ({
    matchId,
    clientId: randomUUID(),
    side: 'home' as const,
    period: '2T' as const,
    minute: 40,
    playerInId,
    playerOutId,
    pitchPoint: null,
  })

  it('swaps a starter for a bench player', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'ao_vivo', 1)

    const { result } = await liveService.substitute(substitutionOf(matchId, season.homeBenchPlayerId, season.homePlayerId), OPERATOR)

    expect(result.ok).toBe(true)
    expect(await isStarter(matchId, season.homeBenchPlayerId)).toBe(true)
    expect(await isStarter(matchId, season.homePlayerId)).toBe(false)
  })

  it('refuses to take off a player who is already on the bench', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'ao_vivo', 1)
    await liveService.substitute(substitutionOf(matchId, season.homeBenchPlayerId, season.homePlayerId), OPERATOR)

    const { result } = await liveService.substitute(substitutionOf(matchId, season.homeBenchPlayerId, season.homePlayerId), OPERATOR)

    expect(result.ok).toBe(false)
    expect(await isStarter(matchId, season.homeBenchPlayerId)).toBe(true)
  })
})

describe('liveService.attachAssist', () => {
  it('refuses to attach an assist to a reverted goal', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'ao_vivo', 1)
    const goalId = await seedEvent(matchId, 'gol', season.homePlayerId)
    await db.update(matchEvents).set({ deletedAt: new Date() }).where(eq(matchEvents.id, goalId))

    const { result } = await liveService.attachAssist(matchId, goalId, season.homeBenchPlayerId)

    expect(result.ok).toBe(false)
  })

  it('recomputes season statistics when the assist is attached after full time', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'encerrado', 1)
    const goalId = await seedEvent(matchId, 'gol', season.homePlayerId)

    const { result, seasonTouch } = await liveService.attachAssist(matchId, goalId, season.homeBenchPlayerId)

    expect(result.ok).toBe(true)
    expect(seasonTouch?.seasonId).toBe(season.seasonId)
  })
})

describe('liveService.updateClock', () => {
  it('removes a match from the standings again when full time is undone', async () => {
    const season = await seedSeason()
    const matchId = await seedMatch(season, 'ao_vivo', 1)
    await seedEvent(matchId, 'gol', season.homePlayerId)
    await liveService.updateClock(matchId, clockAt('TER'))

    const reopened = await liveService.updateClock(matchId, clockAt('2T'))

    const [homeStatistics] = await db.select().from(teamSeasonStats).where(eq(teamSeasonStats.seasonTeamId, season.homeTeamId))
    const [match] = await db.select({ status: matches.status }).from(matches).where(eq(matches.id, matchId))
    expect(match?.status).toBe('ao_vivo')
    expect(reopened).toMatchObject({ ok: true, data: { seasonTouch: { seasonId: season.seasonId } } })
    expect(homeStatistics).toMatchObject({ played: 0, wins: 0 })
  })
})
