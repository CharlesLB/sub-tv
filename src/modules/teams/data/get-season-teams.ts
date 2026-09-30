import 'server-only'
import { and, countDistinct, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { teamBadgeColumns, toTeamBadge } from '@/modules/championships'
import { toTeamKey } from '../lib/team-key/team-key'
import type { SeasonTeamVM } from '../types'

const SORT_LOCALE = 'pt-BR'

export const getSeasonTeams = async (year: number): Promise<SeasonTeamVM[]> => {
  'use cache'
  cacheLife('minutes')

  const { seasons, competitions, seasonTeams, seasonSquads, clubs } = tables

  const rows = await db
    .select({
      clubId: clubs.id,
      category: competitions.category,
      ...teamBadgeColumns(clubs),
      athleteCount: countDistinct(seasonSquads.playerId),
    })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .leftJoin(seasonSquads, and(eq(seasonSquads.seasonTeamId, seasonTeams.id), eq(seasonSquads.isActive, true)))
    .where(eq(seasons.year, year))
    .groupBy(clubs.id, competitions.category)

  const seasonIds = await db.select({ id: seasons.id }).from(seasons).where(eq(seasons.year, year))
  cacheTag(tags.seasons(), tags.fmfData(), ...seasonIds.map((season) => tags.seasonTeams(season.id)))

  return R.pipe(
    rows,
    R.map((row) => ({
      key: toTeamKey(row.category, row.clubId),
      clubId: row.clubId,
      category: row.category,
      badge: toTeamBadge(row),
      athleteCount: row.athleteCount,
    })),
    R.sort((left, right) => left.badge.name.localeCompare(right.badge.name, SORT_LOCALE) || left.category.localeCompare(right.category)),
  )
}
