import 'server-only'
import { and, asc, desc, eq, gt } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { toTeamBadge } from '../lib/mappers/mappers'
import type { TopScorerVM } from '../types'
import { teamBadgeColumns } from './team-badge-columns'

const TOP_SCORERS_LIMIT = 40

export const getTopScorers = async (seasonId: string): Promise<TopScorerVM[]> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.season(seasonId), tags.seasonMatches(seasonId), tags.fmfData())

  const { playerSeasonStats, players, seasonTeams, seasonSquads, clubs } = tables

  const rows = await db
    .select({
      playerId: players.id,
      seasonTeamId: seasonTeams.id,
      shirtNumber: seasonSquads.usualShirtNumber,
      fullName: players.fullName,
      displayName: players.displayName,
      position: players.position,
      badge: teamBadgeColumns(clubs),
      goals: playerSeasonStats.goals,
      games: playerSeasonStats.games,
    })
    .from(playerSeasonStats)
    .innerJoin(players, eq(players.id, playerSeasonStats.playerId))
    .innerJoin(seasonTeams, eq(seasonTeams.id, playerSeasonStats.seasonTeamId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .leftJoin(seasonSquads, and(eq(seasonSquads.seasonTeamId, seasonTeams.id), eq(seasonSquads.playerId, players.id)))
    .where(and(eq(playerSeasonStats.seasonId, seasonId), gt(playerSeasonStats.goals, 0)))
    .orderBy(desc(playerSeasonStats.goals), asc(playerSeasonStats.games), asc(players.fullName))
    .limit(TOP_SCORERS_LIMIT)

  cacheTag(...R.unique(rows.map((row) => tags.teamSquad(row.seasonTeamId))))

  return rows.map((row) => ({
    playerId: row.playerId,
    seasonTeamId: row.seasonTeamId,
    shirtNumber: row.shirtNumber,
    name: row.fullName,
    nickname: row.displayName,
    position: row.position,
    team: toTeamBadge(row.badge),
    goals: row.goals,
    games: row.games,
  }))
}
