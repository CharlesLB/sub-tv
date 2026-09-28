import 'server-only'
import { desc, eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import type { ActiveBroadcastVM } from '../types'

const homeTeam = alias(tables.seasonTeams, 'home_team')
const awayTeam = alias(tables.seasonTeams, 'away_team')
const homeClub = alias(tables.clubs, 'home_club')
const awayClub = alias(tables.clubs, 'away_club')

export const getActiveBroadcast = async (): Promise<ActiveBroadcastVM | null> => {
  'use cache'
  cacheLife('seconds')
  cacheTag(tags.liveMatches())

  const { matches } = tables

  const [row] = await db
    .select({
      matchId: matches.id,
      seasonId: matches.seasonId,
      homeDisplayName: homeClub.displayName,
      homeShortName: homeClub.shortName,
      awayDisplayName: awayClub.displayName,
      awayShortName: awayClub.shortName,
    })
    .from(matches)
    .innerJoin(homeTeam, eq(homeTeam.id, matches.homeTeamId))
    .innerJoin(homeClub, eq(homeClub.id, homeTeam.clubId))
    .innerJoin(awayTeam, eq(awayTeam.id, matches.awayTeamId))
    .innerJoin(awayClub, eq(awayClub.id, awayTeam.clubId))
    .where(eq(matches.isBroadcast, true))
    .orderBy(desc(matches.updatedAt))
    .limit(1)

  if (!row) return null

  return {
    matchId: row.matchId,
    seasonId: row.seasonId,
    homeName: row.homeDisplayName ?? row.homeShortName,
    awayName: row.awayDisplayName ?? row.awayShortName,
  }
}
