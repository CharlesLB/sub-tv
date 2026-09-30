import 'server-only'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { toTeamBadge } from '../lib/mappers/mappers'
import type { MatchCardVM } from '../types'
import { teamBadgeColumns } from './team-badge-columns'

const homeTeam = alias(tables.seasonTeams, 'home_team')
const awayTeam = alias(tables.seasonTeams, 'away_team')
const homeClub = alias(tables.clubs, 'home_club')
const awayClub = alias(tables.clubs, 'away_club')

export const getSeasonMatches = async (seasonId: string): Promise<MatchCardVM[]> => {
  'use cache'
  cacheLife('minutes')
  cacheTag(tags.seasonMatches(seasonId), tags.fmfData())

  const { matches } = tables

  const rows = await db
    .select({
      id: matches.id,
      phase: matches.phase,
      round: matches.round,
      matchNumber: matches.matchNumber,
      kickoffAt: matches.kickoffAt,
      venue: matches.venue,
      city: matches.city,
      status: matches.status,
      isBroadcast: matches.isBroadcast,
      homeTeamId: matches.homeTeamId,
      awayTeamId: matches.awayTeamId,
      homeScore: matches.homeScore,
      awayScore: matches.awayScore,
      homePenalties: matches.homePenalties,
      awayPenalties: matches.awayPenalties,
      home: teamBadgeColumns(homeClub),
      away: teamBadgeColumns(awayClub),
    })
    .from(matches)
    .innerJoin(homeTeam, eq(homeTeam.id, matches.homeTeamId))
    .innerJoin(homeClub, eq(homeClub.id, homeTeam.clubId))
    .innerJoin(awayTeam, eq(awayTeam.id, matches.awayTeamId))
    .innerJoin(awayClub, eq(awayClub.id, awayTeam.clubId))
    .where(and(eq(matches.seasonId, seasonId), isNull(matches.removedAt)))
    .orderBy(asc(matches.kickoffAt), asc(matches.matchNumber))

  return rows.map((row) => ({
    ...row,
    kickoffAt: row.kickoffAt?.toISOString() ?? null,
    home: toTeamBadge(row.home),
    away: toTeamBadge(row.away),
  }))
}
