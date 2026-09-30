import 'server-only'
import { and, eq, isNull } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { getChampionshipHeader, teamBadgeColumns, toTeamBadge } from '@/modules/championships'
import { pickDefaultStarters } from '../lib/default-starters/default-starters'
import { toDateInputInSaoPaulo, toTimeInputInSaoPaulo } from '../lib/kickoff-time/kickoff-time'
import type { MatchSetupVM, PrefillMatchVM, SetupTeamVM } from '../types'
import { readTeamSquads } from './read-team-squads'

const SCHEDULED_STATUS = 'agendado'

const readSeasonTeams = async (seasonId: string) => {
  const { seasonTeams, clubs } = tables

  const rows = await db
    .select({ seasonTeamId: seasonTeams.id, badge: teamBadgeColumns(clubs) })
    .from(seasonTeams)
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(eq(seasonTeams.seasonId, seasonId))

  return R.sortBy(
    rows.map((row) => ({ seasonTeamId: row.seasonTeamId, ...toTeamBadge(row.badge) })),
    (team) => team.name,
  )
}

const readPrefillMatch = async (seasonId: string, matchId: string): Promise<PrefillMatchVM | null> => {
  const { matches } = tables

  const [match] = await db
    .select({
      matchId: matches.id,
      kickoffAt: matches.kickoffAt,
      round: matches.round,
      venue: matches.venue,
      homeSeasonTeamId: matches.homeTeamId,
      awaySeasonTeamId: matches.awayTeamId,
    })
    .from(matches)
    .where(and(eq(matches.id, matchId), eq(matches.seasonId, seasonId), eq(matches.status, SCHEDULED_STATUS), isNull(matches.removedAt)))
    .limit(1)

  if (!match) return null

  return {
    matchId: match.matchId,
    kickoffDate: match.kickoffAt ? toDateInputInSaoPaulo(match.kickoffAt) : null,
    kickoffTime: match.kickoffAt ? toTimeInputInSaoPaulo(match.kickoffAt) : null,
    round: match.round,
    venue: match.venue,
    homeSeasonTeamId: match.homeSeasonTeamId,
    awaySeasonTeamId: match.awaySeasonTeamId,
  }
}

export const getMatchSetup = async (seasonId: string, prefillMatchId: string | null): Promise<MatchSetupVM | null> => {
  'use cache'
  cacheLife('minutes')
  cacheTag(tags.season(seasonId), tags.seasonTeams(seasonId), tags.seasonMatches(seasonId), tags.fmfData())

  const [header, seasonTeams, prefill] = await Promise.all([
    getChampionshipHeader(seasonId),
    readSeasonTeams(seasonId),
    prefillMatchId ? readPrefillMatch(seasonId, prefillMatchId) : Promise.resolve(null),
  ])

  if (!header) return null

  if (seasonTeams.length > 0) cacheTag(...seasonTeams.map((team) => tags.teamSquad(team.seasonTeamId)))
  const squads = await readTeamSquads(seasonTeams.map((team) => team.seasonTeamId))

  const teams: SetupTeamVM[] = seasonTeams.map((team) => {
    const squad = squads[team.seasonTeamId] ?? []

    return {
      ...team,
      players: squad.map((member) => ({ playerId: member.playerId, shirtNumber: member.shirtNumber, name: member.name, nickname: member.nickname, position: member.position })),
      defaultStarterIds: pickDefaultStarters(squad),
    }
  })

  return {
    championship: { id: header.id, name: header.name, category: header.category, year: header.year, currentRound: header.currentRound },
    teams,
    prefill,
  }
}
