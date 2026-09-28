import 'server-only'
import { countDistinct, desc, eq, inArray } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import type { Category } from '../categories'

export type SeasonRow = {
  id: string
  year: number
  label: string
  name: string
  category: Category
  isCurrent: boolean
  teamCount: number
  athleteCount: number
}

const countTeamsAndAthletes = async (seasonIds: string[]) => {
  const { seasonTeams, seasonSquads } = tables
  if (seasonIds.length === 0) return []

  return db
    .select({
      seasonId: seasonTeams.seasonId,
      teamCount: countDistinct(seasonTeams.id),
      athleteCount: countDistinct(seasonSquads.playerId),
    })
    .from(seasonTeams)
    .leftJoin(seasonSquads, eq(seasonSquads.seasonTeamId, seasonTeams.id))
    .where(inArray(seasonTeams.seasonId, seasonIds))
    .groupBy(seasonTeams.seasonId)
}

export const getSeasonRows = async (filter: { year: number } | { seasonId: string }): Promise<SeasonRow[]> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.seasons(), tags.fmfData())

  const { seasons, competitions } = tables
  const condition = 'year' in filter ? eq(seasons.year, filter.year) : eq(seasons.id, filter.seasonId)

  const seasonRows = await db
    .select({
      id: seasons.id,
      year: seasons.year,
      label: seasons.label,
      name: competitions.name,
      category: competitions.category,
      division: competitions.division,
      isCurrent: seasons.isCurrent,
    })
    .from(seasons)
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(condition)
    .orderBy(desc(seasons.year), competitions.category, competitions.division)

  const counts = R.indexBy(await countTeamsAndAthletes(seasonRows.map((season) => season.id)), (row) => row.seasonId)

  return seasonRows.map((season) => ({
    id: season.id,
    year: season.year,
    label: season.label,
    name: season.name,
    category: season.category,
    isCurrent: season.isCurrent,
    teamCount: counts[season.id]?.teamCount ?? 0,
    athleteCount: counts[season.id]?.athleteCount ?? 0,
  }))
}
