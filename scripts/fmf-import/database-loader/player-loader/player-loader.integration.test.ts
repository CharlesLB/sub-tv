import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { matchEvents, matchLineups, seasonTeams } from '@/lib/db/schema'
import type { TableMatch } from '../../competition-page/table-tab-parser/table-tab-parser'
import type { LoadedSumula } from '../../edition-bundle/edition-bundle'
import type { ParsedSumula, SumulaPlayer } from '../../sumula/sumula-types/sumula-types'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import type { LoadedMatch } from '../match-loader/match-loader'
import { loadLineups } from './player-loader'
import { type SeededSeason, seedMatch, seedSeason } from '@/test/database-seeds/database-seeds'

const HOME_CREST = '101'
const AWAY_CREST = '102'
const SHARED_SHIRT = 10

const tableMatch: TableMatch = {
  phase: 'CLASSIFICATÓRIA',
  round: 1,
  matchNumber: 1,
  date: '2026-10-03',
  time: '09:00',
  home: { crestId: HOME_CREST, crestFileName: `${HOME_CREST}.png`, shortName: 'ALFA' },
  away: { crestId: AWAY_CREST, crestFileName: `${AWAY_CREST}.png`, shortName: 'BETA' },
  homeScore: 1,
  awayScore: 0,
  venue: null,
  city: null,
  officials: [],
  sumulaUrl: null,
}

const sumulaWith = (players: SumulaPlayer[]): LoadedSumula => {
  const parsed: ParsedSumula = {
    header: {
      competition: null,
      phase: null,
      round: null,
      homeName: 'ALFA',
      awayName: 'BETA',
      date: null,
      time: null,
      venue: null,
      homeScore: 1,
      awayScore: 0,
      homeScoreHalfTime: null,
      awayScoreHalfTime: null,
      homePenalties: null,
      awayPenalties: null,
      addedTimeFirstHalf: null,
      addedTimeSecondHalf: null,
    },
    players,
    staff: [],
    goals: [],
    cards: [],
    substitutions: [],
    warnings: [],
  }

  return { reference: { url: 'https://example.test/1.pdf', fileName: '1.pdf', fmfMatchId: 1, revision: 0 }, relativePath: '1.pdf', sha256: null, parsed, failure: null, skipped: false }
}

const clubOf = async (seasonTeamId: string): Promise<string> => (await db.select({ clubId: seasonTeams.clubId }).from(seasonTeams).where(eq(seasonTeams.id, seasonTeamId)))[0]?.clubId ?? ''

const seedBroadcastMatch = async (season: SeededSeason): Promise<string> => {
  const matchId = await seedMatch(season, 'encerrado', 1)
  await db.update(matchLineups).set({ source: 'manual' }).where(eq(matchLineups.matchId, matchId))

  return matchId
}

describe('loadLineups', () => {
  it('replaces the operator lineup of a broadcast match with the official súmula lineup', async () => {
    const season = await seedSeason()
    const matchId = await seedBroadcastMatch(season)
    await db.insert(matchEvents).values({ matchId, side: 'home', type: 'gol', period: '1T', minute: 10, playerId: season.homePlayerId, goalType: 'normal', source: 'ao_vivo' })

    const teams: SeasonTeamLookup = new Map([
      [HOME_CREST, { clubId: await clubOf(season.homeTeamId), seasonTeamId: season.homeTeamId }],
      [AWAY_CREST, { clubId: await clubOf(season.awayTeamId), seasonTeamId: season.awayTeamId }],
    ])

    const officialPlayer: SumulaPlayer = { side: 'home', shirtNumber: SHARED_SHIRT, nickname: null, fullName: 'Diego Official', cbfId: '900001', isStarter: true, isCaptain: false }
    const loaded: LoadedMatch = { matchId, tableMatch, sumula: sumulaWith([officialPlayer]), homeSeasonTeamId: season.homeTeamId, awaySeasonTeamId: season.awayTeamId }

    const result = await db.transaction(async (transaction) => await loadLineups(transaction, [loaded], teams))

    const officialPlayerId = result.lookup.get(matchId)?.get(`home|${SHARED_SHIRT}`)
    const lineup = await db.select({ playerId: matchLineups.playerId, shirtNumber: matchLineups.shirtNumber, source: matchLineups.source }).from(matchLineups).where(eq(matchLineups.matchId, matchId))
    expect(officialPlayerId).toBeDefined()
    expect(lineup).toEqual([{ playerId: officialPlayerId, shirtNumber: SHARED_SHIRT, source: 'fmf' }])
  })

  it('keeps the operator lineup when the súmula lists no players', async () => {
    const season = await seedSeason()
    const matchId = await seedBroadcastMatch(season)
    const loaded: LoadedMatch = { matchId, tableMatch, sumula: sumulaWith([]), homeSeasonTeamId: season.homeTeamId, awaySeasonTeamId: season.awayTeamId }

    await db.transaction(async (transaction) => await loadLineups(transaction, [loaded], new Map()))

    expect(await db.select().from(matchLineups).where(eq(matchLineups.matchId, matchId))).toHaveLength(3)
  })
})
