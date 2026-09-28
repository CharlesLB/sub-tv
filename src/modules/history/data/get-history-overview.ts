import 'server-only'
import { and, asc, count, countDistinct, desc, eq, gt, inArray, isNotNull, isNull, sql } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { teamBadgeColumns, toTeamBadge } from '@/modules/championships'
import { toTeamKey } from '@/modules/teams'
import type { HistoryFilter } from '../history-filter/history-filter'
import { winRatePercent } from '../stat-format/stat-format'
import type { AccumulatedTeamRowVM, HistoryOverviewVM, PeriodScorerVM } from '../types'
import { FINISHED_MATCH_STATUS, seasonFilterConditions, sumAsNumber } from './season-filter-conditions'

const PERIOD_SCORERS_LIMIT = 10
const MINIMUM_GAMES_FOR_WIN_RATE = 10

const readChampionshipCount = async (filter: HistoryFilter): Promise<number> => {
  const { seasons, competitions } = tables

  const [row] = await db
    .select({ championshipCount: countDistinct(seasons.id) })
    .from(seasons)
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(...seasonFilterConditions(filter)))

  return row?.championshipCount ?? 0
}

const readMatchTotals = async (filter: HistoryFilter): Promise<{ matchCount: number; goalCount: number }> => {
  const { matches, seasons, competitions } = tables

  const [row] = await db
    .select({ matchCount: count(), goalCount: sumAsNumber(sql`${matches.homeScore} + ${matches.awayScore}`) })
    .from(matches)
    .innerJoin(seasons, eq(seasons.id, matches.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(matches.status, FINISHED_MATCH_STATUS), isNull(matches.removedAt), isNotNull(matches.homeScore), isNotNull(matches.awayScore), ...seasonFilterConditions(filter)))

  return { matchCount: row?.matchCount ?? 0, goalCount: row?.goalCount ?? 0 }
}

const readAccumulatedTable = async (filter: HistoryFilter): Promise<AccumulatedTeamRowVM[]> => {
  const { teamSeasonStats, seasonTeams, seasons, competitions, clubs } = tables
  const points = sumAsNumber(teamSeasonStats.points)
  const goalsFor = sumAsNumber(teamSeasonStats.goalsFor)
  const goalsAgainst = sumAsNumber(teamSeasonStats.goalsAgainst)

  const rows = await db
    .select({
      clubId: clubs.id,
      category: competitions.category,
      badge: teamBadgeColumns(clubs),
      played: sumAsNumber(teamSeasonStats.played),
      wins: sumAsNumber(teamSeasonStats.wins),
      draws: sumAsNumber(teamSeasonStats.draws),
      losses: sumAsNumber(teamSeasonStats.losses),
      goalsFor,
      goalsAgainst,
      points,
    })
    .from(teamSeasonStats)
    .innerJoin(seasonTeams, eq(seasonTeams.id, teamSeasonStats.seasonTeamId))
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(and(...seasonFilterConditions(filter)))
    .groupBy(clubs.id, competitions.category)
    .orderBy(desc(points), desc(sql`${goalsFor} - ${goalsAgainst}`), desc(goalsFor))

  return rows.map(({ badge, clubId, ...row }) => ({
    ...row,
    teamKey: toTeamKey(row.category, clubId),
    team: toTeamBadge(badge),
    goalDifference: row.goalsFor - row.goalsAgainst,
    winRate: winRatePercent(row.points, row.played),
  }))
}

const readPeriodScorers = async (filter: HistoryFilter): Promise<PeriodScorerVM[]> => {
  const { playerSeasonStats, players, seasons, competitions, seasonTeams, clubs } = tables
  const goals = sumAsNumber(playerSeasonStats.goals)
  const games = sumAsNumber(playerSeasonStats.games)

  const rows = await db
    .select({
      playerId: players.id,
      name: players.fullName,
      category: competitions.category,
      goals,
      games,
      seasonCount: countDistinct(seasons.year),
      latestClubId: sql<string>`(array_agg(${clubs.id}::text order by ${seasons.year} desc))[1]`,
    })
    .from(playerSeasonStats)
    .innerJoin(players, eq(players.id, playerSeasonStats.playerId))
    .innerJoin(seasons, eq(seasons.id, playerSeasonStats.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(seasonTeams, eq(seasonTeams.id, playerSeasonStats.seasonTeamId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(and(...seasonFilterConditions(filter)))
    .groupBy(players.id, competitions.category)
    .having(gt(goals, 0))
    .orderBy(desc(goals), asc(games), asc(players.fullName))
    .limit(PERIOD_SCORERS_LIMIT)

  const clubIds = R.unique(rows.map((row) => row.latestClubId))

  const badges =
    clubIds.length > 0
      ? await db
          .select({ id: clubs.id, badge: teamBadgeColumns(clubs) })
          .from(clubs)
          .where(inArray(clubs.id, clubIds))
      : []

  const badgeByClub = R.indexBy(badges, (club) => club.id)

  return rows.flatMap(({ latestClubId, ...row }) => {
    const club = badgeByClub[latestClubId]

    return club ? [{ ...row, team: toTeamBadge(club.badge) }] : []
  })
}

const pickBest = (rows: AccumulatedTeamRowVM[], score: (row: AccumulatedTeamRowVM) => number): AccumulatedTeamRowVM | null => R.firstBy(rows, [score, 'desc']) ?? null

export const getHistoryOverview = async (filter: HistoryFilter): Promise<HistoryOverviewVM> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.history(), tags.fmfData())

  const [championshipCount, matchTotals, table, scorers] = await Promise.all([readChampionshipCount(filter), readMatchTotals(filter), readAccumulatedTable(filter), readPeriodScorers(filter)])
  const qualifiedTeams = table.filter((row) => row.played >= MINIMUM_GAMES_FOR_WIN_RATE)

  return {
    championshipCount,
    ...matchTotals,
    bestWinRate: pickBest(qualifiedTeams, (row) => row.winRate),
    mostGames: pickBest(table, (row) => row.played),
    table,
    scorers,
  }
}
