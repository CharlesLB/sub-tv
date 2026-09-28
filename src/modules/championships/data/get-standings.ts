import 'server-only'
import { asc, desc, eq } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import * as R from 'remeda'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { toTeamBadge } from '../mappers'
import { buildRecentForm } from '../recent-form/recent-form'
import type { SquadPreviewPlayerVM, StandingPhaseVM, StandingRowVM } from '../types'
import { getSeasonMatches } from './get-season-matches'
import { teamBadgeColumns } from './team-badge-columns'

const JOINT_PHASE_PREFIX = 'CONJUNTA'
const OVERALL_PHASE = 'Geral'

type StandingSource = Omit<StandingRowVM, 'form' | 'squad' | 'goalDifference'> & { phase: string; groupName: string | null }

const readOfficialStandings = async (seasonId: string): Promise<StandingSource[]> => {
  const { fmfStandings, seasonTeams, clubs } = tables
  const rows = await db
    .select({
      phase: fmfStandings.phase,
      position: fmfStandings.position,
      points: fmfStandings.points,
      played: fmfStandings.played,
      wins: fmfStandings.wins,
      draws: fmfStandings.draws,
      losses: fmfStandings.losses,
      goalsFor: fmfStandings.goalsFor,
      goalsAgainst: fmfStandings.goalsAgainst,
      seasonTeamId: seasonTeams.id,
      groupName: seasonTeams.groupName,
      clubId: clubs.id,
      badge: teamBadgeColumns(clubs),
    })
    .from(fmfStandings)
    .innerJoin(seasonTeams, eq(seasonTeams.id, fmfStandings.seasonTeamId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(eq(fmfStandings.seasonId, seasonId))
    .orderBy(asc(fmfStandings.position))

  return rows.map(({ badge, ...row }) => ({ ...row, team: toTeamBadge(badge) }))
}

const readComputedStandings = async (seasonId: string): Promise<StandingSource[]> => {
  const { teamSeasonStats, seasonTeams, clubs } = tables
  const rows = await db
    .select({
      points: teamSeasonStats.points,
      played: teamSeasonStats.played,
      wins: teamSeasonStats.wins,
      draws: teamSeasonStats.draws,
      losses: teamSeasonStats.losses,
      goalsFor: teamSeasonStats.goalsFor,
      goalsAgainst: teamSeasonStats.goalsAgainst,
      seasonTeamId: seasonTeams.id,
      groupName: seasonTeams.groupName,
      clubId: clubs.id,
      badge: teamBadgeColumns(clubs),
    })
    .from(teamSeasonStats)
    .innerJoin(seasonTeams, eq(seasonTeams.id, teamSeasonStats.seasonTeamId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(eq(seasonTeams.seasonId, seasonId))
    .orderBy(desc(teamSeasonStats.points), desc(teamSeasonStats.wins))

  return rows.map(({ badge, ...row }, index) => ({ ...row, phase: OVERALL_PHASE, position: index + 1, team: toTeamBadge(badge) }))
}

const readSquadPreviews = async (seasonId: string): Promise<Record<string, SquadPreviewPlayerVM[]>> => {
  const { seasonSquads, seasonTeams, players } = tables
  const rows = await db
    .select({
      seasonTeamId: seasonSquads.seasonTeamId,
      playerId: players.id,
      shirtNumber: seasonSquads.usualShirtNumber,
      fullName: players.fullName,
      displayName: players.displayName,
      position: players.position,
    })
    .from(seasonSquads)
    .innerJoin(seasonTeams, eq(seasonTeams.id, seasonSquads.seasonTeamId))
    .innerJoin(players, eq(players.id, seasonSquads.playerId))
    .where(eq(seasonTeams.seasonId, seasonId))
    .orderBy(asc(seasonSquads.usualShirtNumber))

  return R.groupBy(
    rows.map((row) => ({
      seasonTeamId: row.seasonTeamId,
      playerId: row.playerId,
      shirtNumber: row.shirtNumber,
      name: row.displayName ?? row.fullName,
      position: row.position,
    })),
    (row) => row.seasonTeamId,
  )
}

const phaseOrder = (phase: string, rowCount: number): [number, number] => [phase.startsWith(JOINT_PHASE_PREFIX) ? 1 : 0, -rowCount]

export const getStandings = async (seasonId: string): Promise<StandingPhaseVM[]> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.season(seasonId), tags.seasonMatches(seasonId), tags.fmfData())

  const [officialRows, matches, squads] = await Promise.all([readOfficialStandings(seasonId), getSeasonMatches(seasonId), readSquadPreviews(seasonId)])
  const sourceRows = officialRows.length > 0 ? officialRows : await readComputedStandings(seasonId)
  const recentForm = buildRecentForm(matches)
  const phases = R.groupBy(sourceRows, (row) => row.phase)

  return R.pipe(
    R.entries(phases),
    R.sortBy(([phase, rows]) => phaseOrder(phase, rows.length)[0], ([phase, rows]) => phaseOrder(phase, rows.length)[1]),
    R.map(([phase, rows]) => ({
      phase,
      groups: R.pipe(
        R.entries(R.groupBy(rows, (row) => row.groupName ?? '')),
        R.sortBy(([groupName]) => groupName),
        R.map(([groupName, groupRows]) => ({
          groupName: groupName === '' ? null : groupName,
          rows: groupRows.map((row) => ({
            position: row.position,
            seasonTeamId: row.seasonTeamId,
            clubId: row.clubId,
            team: row.team,
            points: row.points,
            played: row.played,
            wins: row.wins,
            draws: row.draws,
            losses: row.losses,
            goalsFor: row.goalsFor,
            goalsAgainst: row.goalsAgainst,
            goalDifference: row.goalsFor - row.goalsAgainst,
            form: recentForm[row.seasonTeamId] ?? [],
            squad: squads[row.seasonTeamId] ?? [],
          })),
        })),
      ),
    })),
  )
}
