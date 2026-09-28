import 'server-only'
import { eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { CATEGORY } from '../categories'
import { toTeamBadge } from '../mappers'
import type { CategoryClubsVM, ClubOptionVM } from '../types'
import { teamBadgeColumns } from './team-badge-columns'

const SORT_LOCALE = 'pt-BR'

export const getCategoryClubs = async (): Promise<CategoryClubsVM> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.seasons(), tags.fmfData())

  const { clubs, seasonTeams, seasons, competitions } = tables
  const rows = await db
    .selectDistinct({ clubId: clubs.id, category: competitions.category, ...teamBadgeColumns(clubs) })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
  const optionsOf = (category: string): ClubOptionVM[] =>
    rows
      .filter((row) => row.category === category)
      .map((row) => ({ clubId: row.clubId, badge: toTeamBadge(row) }))
      .sort((left, right) => left.badge.name.localeCompare(right.badge.name, SORT_LOCALE))

  return { [CATEGORY.SUB13]: optionsOf(CATEGORY.SUB13), [CATEGORY.SUB14]: optionsOf(CATEGORY.SUB14) }
}
