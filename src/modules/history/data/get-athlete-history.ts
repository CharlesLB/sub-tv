import 'server-only'
import { and, desc, eq, sql } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { teamBadgeColumns, toTeamBadge } from '@/modules/championships'
import type { HistoryFilter } from '../history-filter/history-filter'
import type { AthleteHistoryVM, AthleteSeasonVM } from '../types'
import { distinctTextList, seasonFilterConditions, sumAsNumber } from './season-filter-conditions'

type AthleteScope = { playerId: string; filter: HistoryFilter }

const POSITION_LABEL: Record<string, string> = {
  goleiro: 'Goleiro',
  zagueiro: 'Zagueiro',
  lateral: 'Lateral',
  volante: 'Volante',
  meia: 'Meia',
  atacante: 'Atacante',
}

const readPlayer = async (playerId: string) => {
  const { players } = tables
  const [row] = await db
    .select({ fullName: players.fullName, nickname: players.nickname, displayName: players.displayName, position: players.position })
    .from(players)
    .where(eq(players.id, playerId))

  return row ?? null
}

const readSeasons = async ({ playerId, filter }: AthleteScope): Promise<AthleteSeasonVM[]> => {
  const { playerSeasonStats, seasons, competitions } = tables

  return db
    .select({
      year: seasons.year,
      championships: distinctTextList(competitions.name),
      games: sumAsNumber(playerSeasonStats.games),
      goals: sumAsNumber(playerSeasonStats.goals),
    })
    .from(playerSeasonStats)
    .innerJoin(seasons, eq(seasons.id, playerSeasonStats.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(playerSeasonStats.playerId, playerId), ...seasonFilterConditions(filter)))
    .groupBy(seasons.year)
    .orderBy(desc(seasons.year))
}

const readLatestTeam = async ({ playerId, filter }: AthleteScope) => {
  const { playerSeasonStats, seasonTeams, seasons, competitions, clubs } = tables
  const [row] = await db
    .select({ category: competitions.category, badge: teamBadgeColumns(clubs) })
    .from(playerSeasonStats)
    .innerJoin(seasonTeams, eq(seasonTeams.id, playerSeasonStats.seasonTeamId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .innerJoin(seasons, eq(seasons.id, playerSeasonStats.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(playerSeasonStats.playerId, playerId), ...seasonFilterConditions(filter)))
    .orderBy(desc(seasons.year), desc(playerSeasonStats.games))
    .limit(1)

  return row ? { category: row.category, team: toTeamBadge(row.badge) } : null
}

const readMostUsedShirtNumber = async ({ playerId, filter }: AthleteScope): Promise<number | null> => {
  const { matchLineups, matches, seasons, competitions } = tables
  const [row] = await db
    .select({ shirtNumber: sql<number | null>`mode() within group (order by ${matchLineups.shirtNumber})` })
    .from(matchLineups)
    .innerJoin(matches, eq(matches.id, matchLineups.matchId))
    .innerJoin(seasons, eq(seasons.id, matches.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(matchLineups.playerId, playerId), ...seasonFilterConditions(filter)))

  return row?.shirtNumber ?? null
}

export const getAthleteHistory = async (playerId: string, filter: HistoryFilter): Promise<AthleteHistoryVM | null> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.history(), tags.fmfData())

  const scope = { playerId, filter }
  const [player, seasons, latestTeam, shirtNumber] = await Promise.all([readPlayer(playerId), readSeasons(scope), readLatestTeam(scope), readMostUsedShirtNumber(scope)])
  if (!player) return null

  return {
    playerId,
    name: player.fullName,
    nickname: player.displayName ?? player.nickname,
    position: player.position ? (POSITION_LABEL[player.position] ?? null) : null,
    shirtNumber,
    team: latestTeam?.team ?? null,
    category: latestTeam?.category ?? null,
    goals: R.sumBy(seasons, (season) => season.goals),
    games: R.sumBy(seasons, (season) => season.games),
    seasons,
    bestSeason: R.firstBy(seasons.filter((season) => season.goals > 0), [(season) => season.goals, 'desc']) ?? null,
  }
}
