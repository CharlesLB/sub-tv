import 'server-only'
import { and, asc, eq, inArray, isNull, or } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { otherCategory, teamBadgeColumns, toTeamBadge, type Category } from '@/modules/championships'
import { toTeamKey } from '@/modules/teams'
import { buildSquadPlayers } from '../squad-roster/squad-roster'
import type { TeamSquadVM } from '../types'

type TeamIdentity = { year: number; category: Category; clubId: string }

const { seasons, competitions, seasonTeams, seasonSquads, players, playerSeasonStats, curiosities, clubs } = tables

const findSeasonTeams = (team: TeamIdentity) =>
  db
    .select({ id: seasonTeams.id, seasonId: seasonTeams.seasonId })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(seasons.year, team.year), eq(competitions.category, team.category), eq(seasonTeams.clubId, team.clubId)))
    .orderBy(asc(competitions.division), asc(seasons.label))

const findMemberships = (seasonTeamIds: string[]) =>
  db
    .select({
      seasonTeamId: seasonSquads.seasonTeamId,
      playerId: players.id,
      usualShirtNumber: seasonSquads.usualShirtNumber,
      fullName: players.fullName,
      nickname: players.nickname,
      displayName: players.displayName,
      position: players.position,
      preferredFoot: players.preferredFoot,
    })
    .from(seasonSquads)
    .innerJoin(players, eq(players.id, seasonSquads.playerId))
    .where(and(inArray(seasonSquads.seasonTeamId, seasonTeamIds), eq(seasonSquads.isActive, true)))

const findStats = (seasonTeamIds: string[]) =>
  db
    .select({
      playerId: playerSeasonStats.playerId,
      games: playerSeasonStats.games,
      goals: playerSeasonStats.goals,
      yellowCards: playerSeasonStats.yellowCards,
      redCards: playerSeasonStats.redCards,
    })
    .from(playerSeasonStats)
    .where(inArray(playerSeasonStats.seasonTeamId, seasonTeamIds))

const findCuriosities = (playerIds: string[], seasonIds: string[]) =>
  playerIds.length === 0
    ? Promise.resolve([])
    : db
        .select({ id: curiosities.id, playerId: curiosities.playerId, text: curiosities.text })
        .from(curiosities)
        .where(and(inArray(curiosities.playerId, playerIds), or(isNull(curiosities.seasonId), inArray(curiosities.seasonId, seasonIds))))
        .orderBy(asc(curiosities.sortOrder), asc(curiosities.createdAt))

const findPlayerIdsOfTeam = async (team: TeamIdentity): Promise<string[]> => {
  const rows = await db
    .selectDistinct({ playerId: seasonSquads.playerId })
    .from(seasonSquads)
    .innerJoin(seasonTeams, eq(seasonTeams.id, seasonSquads.seasonTeamId))
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(seasons.year, team.year), eq(competitions.category, team.category), eq(seasonTeams.clubId, team.clubId), eq(seasonSquads.isActive, true)))

  return rows.map((row) => row.playerId)
}

export const getTeamSquad = async (year: number, category: Category, clubId: string): Promise<TeamSquadVM | null> => {
  'use cache'
  cacheLife('hours')

  const team = { year, category, clubId }
  const teamRows = await findSeasonTeams(team)
  cacheTag(tags.fmfData(), ...teamRows.map((row) => tags.teamSquad(row.id)))
  const [club] = await db.select(teamBadgeColumns(clubs)).from(clubs).where(eq(clubs.id, clubId))
  if (teamRows.length === 0 || !club) return null

  const seasonTeamIds = teamRows.map((row) => row.id)
  const [memberships, stats, otherCategoryPlayerIds] = await Promise.all([
    findMemberships(seasonTeamIds),
    findStats(seasonTeamIds),
    findPlayerIdsOfTeam({ ...team, category: otherCategory[category] }),
  ])
  const squadCuriosities = await findCuriosities(
    memberships.map((membership) => membership.playerId),
    teamRows.map((row) => row.seasonId),
  )

  return {
    key: toTeamKey(category, clubId),
    clubId,
    category,
    year,
    badge: toTeamBadge(club),
    otherCategoryKey: toTeamKey(otherCategory[category], clubId),
    players: buildSquadPlayers({ seasonTeamIds, memberships, stats, curiosities: squadCuriosities, otherCategoryPlayerIds }),
  }
}
