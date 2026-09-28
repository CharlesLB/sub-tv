import 'server-only'
import { eq, inArray } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as R from 'remeda'
import { db, tables } from '@/lib/db'
import { isUuid } from '@/lib/utils/is-uuid/is-uuid'
import { AUDIT_ENTITY, type AuditEntity } from '../audit-action'

export type EntityReference = { entityType: string; entityId: string | null }

const MATCH_SEPARATOR = ' · '

const idsOf = (references: readonly EntityReference[], entityType: AuditEntity): string[] =>
  R.unique(references.flatMap((reference) => (reference.entityType === entityType && reference.entityId && isUuid(reference.entityId) ? [reference.entityId] : [])))

const describePlayers = async (playerIds: string[]): Promise<Record<string, string>> => {
  const { players } = tables
  if (playerIds.length === 0) return {}

  const rows = await db.select({ id: players.id, fullName: players.fullName, displayName: players.displayName }).from(players).where(inArray(players.id, playerIds))

  return Object.fromEntries(rows.map((row) => [row.id, row.displayName ? `${row.fullName} (${row.displayName})` : row.fullName]))
}

const describeMatches = async (matchIds: string[]): Promise<Record<string, string>> => {
  const { matches, seasons, competitions, seasonTeams, clubs } = tables
  if (matchIds.length === 0) return {}

  const homeTeam = alias(seasonTeams, 'home_team')
  const awayTeam = alias(seasonTeams, 'away_team')
  const homeClub = alias(clubs, 'home_club')
  const awayClub = alias(clubs, 'away_club')

  const rows = await db
    .select({
      id: matches.id,
      homeName: homeClub.displayName,
      homeShortName: homeClub.shortName,
      awayName: awayClub.displayName,
      awayShortName: awayClub.shortName,
      competitionName: competitions.name,
      year: seasons.year,
    })
    .from(matches)
    .innerJoin(seasons, eq(seasons.id, matches.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(homeTeam, eq(homeTeam.id, matches.homeTeamId))
    .innerJoin(awayTeam, eq(awayTeam.id, matches.awayTeamId))
    .innerJoin(homeClub, eq(homeClub.id, homeTeam.clubId))
    .innerJoin(awayClub, eq(awayClub.id, awayTeam.clubId))
    .where(inArray(matches.id, matchIds))

  return Object.fromEntries(rows.map((row) => [row.id, `${row.homeName ?? row.homeShortName} × ${row.awayName ?? row.awayShortName}${MATCH_SEPARATOR}${row.competitionName} ${row.year}`]))
}

const describeUsers = async (userIds: string[]): Promise<Record<string, string>> => {
  const { appUsers } = tables
  if (userIds.length === 0) return {}

  const rows = await db.select({ id: appUsers.id, username: appUsers.username }).from(appUsers).where(inArray(appUsers.id, userIds))

  return Object.fromEntries(rows.map((row) => [row.id, row.username]))
}

const describeChampionships = async (seasonIds: string[]): Promise<Record<string, string>> => {
  const { seasons, competitions } = tables
  if (seasonIds.length === 0) return {}

  const rows = await db
    .select({ id: seasons.id, name: competitions.name, year: seasons.year })
    .from(seasons)
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(inArray(seasons.id, seasonIds))

  return Object.fromEntries(rows.map((row) => [row.id, `${row.name} ${row.year}`]))
}

export const resolveEntityDescriptions = async (references: readonly EntityReference[]): Promise<Record<string, string>> => {
  const [playerNames, matchNames, userNames, championshipNames] = await Promise.all([
    describePlayers(idsOf(references, AUDIT_ENTITY.PLAYER)),
    describeMatches(idsOf(references, AUDIT_ENTITY.MATCH)),
    describeUsers(idsOf(references, AUDIT_ENTITY.USER)),
    describeChampionships(idsOf(references, AUDIT_ENTITY.CHAMPIONSHIP)),
  ])

  return { ...playerNames, ...matchNames, ...userNames, ...championshipNames }
}
