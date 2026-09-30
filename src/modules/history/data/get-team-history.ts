import 'server-only'
import { and, asc, desc, eq, gt, inArray, isNotNull, isNull, or } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { teamBadgeColumns, toTeamBadge } from '@/modules/championships'
import { parseTeamKey } from '@/modules/teams'
import { countCompetitionPresences } from '../lib/competition-presences/competition-presences'
import type { HistoryFilter } from '../lib/history-filter/history-filter'
import { buildFormByYear } from '../lib/season-form/season-form'
import { winRatePercent } from '../lib/stat-format/stat-format'
import type { TeamHistoryVM, TeamScorerVM, TeamSeasonVM } from '../types'
import { distinctTextList, FINISHED_MATCH_STATUS, seasonFilterConditions, sumAsNumber } from './season-filter-conditions'

const TEAM_SCORERS_LIMIT = 6

type TeamScope = { clubId: string; filter: HistoryFilter }

const readSeasonRows = async ({ clubId, filter }: TeamScope) => {
  const { seasonTeams, seasons, competitions, teamSeasonStats } = tables

  return db
    .select({
      year: seasons.year,
      championships: distinctTextList(competitions.name),
      seasonTeamIds: distinctTextList(seasonTeams.id),
      played: sumAsNumber(teamSeasonStats.played),
      wins: sumAsNumber(teamSeasonStats.wins),
      draws: sumAsNumber(teamSeasonStats.draws),
      losses: sumAsNumber(teamSeasonStats.losses),
      goalsFor: sumAsNumber(teamSeasonStats.goalsFor),
      goalsAgainst: sumAsNumber(teamSeasonStats.goalsAgainst),
      points: sumAsNumber(teamSeasonStats.points),
    })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .leftJoin(teamSeasonStats, eq(teamSeasonStats.seasonTeamId, seasonTeams.id))
    .where(and(eq(seasonTeams.clubId, clubId), ...seasonFilterConditions(filter)))
    .groupBy(seasons.year)
    .orderBy(desc(seasons.year))
}

const readFinishedMatches = async (seasonTeamIds: string[]) => {
  const { matches, seasons } = tables
  if (seasonTeamIds.length === 0) return []

  const rows = await db
    .select({
      year: seasons.year,
      homeTeamId: matches.homeTeamId,
      awayTeamId: matches.awayTeamId,
      homeScore: matches.homeScore,
      awayScore: matches.awayScore,
    })
    .from(matches)
    .innerJoin(seasons, eq(seasons.id, matches.seasonId))
    .where(
      and(
        or(inArray(matches.homeTeamId, seasonTeamIds), inArray(matches.awayTeamId, seasonTeamIds)),
        eq(matches.status, FINISHED_MATCH_STATUS),
        isNull(matches.removedAt),
        isNotNull(matches.homeScore),
        isNotNull(matches.awayScore),
      ),
    )
    .orderBy(asc(matches.kickoffAt), asc(matches.matchNumber))

  return rows.map((row) => ({ ...row, homeScore: row.homeScore ?? 0, awayScore: row.awayScore ?? 0 }))
}

const readTeamScorers = async ({ clubId, filter }: TeamScope): Promise<TeamScorerVM[]> => {
  const { playerSeasonStats, players, seasonTeams, seasons, competitions } = tables
  const goals = sumAsNumber(playerSeasonStats.goals)
  const games = sumAsNumber(playerSeasonStats.games)

  return db
    .select({ playerId: players.id, name: players.fullName, goals, games })
    .from(playerSeasonStats)
    .innerJoin(players, eq(players.id, playerSeasonStats.playerId))
    .innerJoin(seasonTeams, eq(seasonTeams.id, playerSeasonStats.seasonTeamId))
    .innerJoin(seasons, eq(seasons.id, playerSeasonStats.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(seasonTeams.clubId, clubId), ...seasonFilterConditions(filter)))
    .groupBy(players.id)
    .having(gt(goals, 0))
    .orderBy(desc(goals), asc(games), asc(players.fullName))
    .limit(TEAM_SCORERS_LIMIT)
}

const readClubBadge = async (clubId: string) => {
  const { clubs } = tables

  const [row] = await db
    .select({ badge: teamBadgeColumns(clubs) })
    .from(clubs)
    .where(eq(clubs.id, clubId))

  return row ? toTeamBadge(row.badge) : null
}

const sumRecords = (seasons: TeamSeasonVM[]): TeamHistoryVM['totals'] => {
  const totals = {
    played: R.sumBy(seasons, (season) => season.played),
    wins: R.sumBy(seasons, (season) => season.wins),
    draws: R.sumBy(seasons, (season) => season.draws),
    losses: R.sumBy(seasons, (season) => season.losses),
    goalsFor: R.sumBy(seasons, (season) => season.goalsFor),
    goalsAgainst: R.sumBy(seasons, (season) => season.goalsAgainst),
    points: R.sumBy(seasons, (season) => season.points),
  }

  return { ...totals, goalDifference: totals.goalsFor - totals.goalsAgainst, winRate: winRatePercent(totals.points, totals.played) }
}

export const getTeamHistory = async (teamKey: string, filter: HistoryFilter): Promise<TeamHistoryVM | null> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.history(), tags.fmfData())

  const parsedKey = parseTeamKey(teamKey)
  if (!parsedKey) return null

  const scope = { clubId: parsedKey.clubId, filter: { ...filter, category: parsedKey.category } }
  const [team, seasonRows, scorers] = await Promise.all([readClubBadge(parsedKey.clubId), readSeasonRows(scope), readTeamScorers(scope)])
  if (!team) return null

  const seasonTeamIds = seasonRows.flatMap((row) => row.seasonTeamIds)
  const formByYear = buildFormByYear(await readFinishedMatches(seasonTeamIds), new Set(seasonTeamIds))
  const seasons = seasonRows.map(({ seasonTeamIds: _seasonTeamIds, ...row }) => ({ ...row, form: formByYear[row.year] ?? [] }))

  return {
    teamKey,
    category: parsedKey.category,
    team,
    totals: sumRecords(seasons),
    seasons,
    scorers,
    presences: countCompetitionPresences(seasons),
  }
}
