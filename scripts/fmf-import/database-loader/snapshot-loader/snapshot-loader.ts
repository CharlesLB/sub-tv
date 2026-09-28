import { eq } from 'drizzle-orm'
import * as R from 'remeda'
import { fmfStandings, fmfTopScorers, players, seasonSquads, seasonTeams } from '../../../../src/lib/db/schema'
import type { StandingRow } from '../../competition-page/standings-tab-parser/standings-tab-parser'
import { CURRENT_SEASON_YEAR } from '../../constants/fmf-sources'
import type { EditionBundle } from '../../edition-bundle/edition-bundle'
import { areNamesCompatible, normalizeName } from '../../text-normalization/text-normalization'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import { type Transaction, inChunks } from '../database-context/database-context'

const JOINT_PHASE_PREFIX = 'CONJUNTA · '
const GROUP_SEPARATOR = ' · GRUPO '

const phaseLabel = (row: StandingRow, prefix: string): string => `${prefix}${row.phase}${row.groupName ? `${GROUP_SEPARATOR}${row.groupName}` : ''}`

const standingRows = (rows: StandingRow[], prefix: string, seasonId: string, teams: SeasonTeamLookup, fetchedAt: Date) =>
  rows.flatMap((row) => {
    const seasonTeamId = teams.get(row.team.crestId)?.seasonTeamId
    if (!seasonTeamId) return []

    return [
      {
        seasonId,
        seasonTeamId,
        phase: phaseLabel(row, prefix),
        position: row.position,
        points: row.points,
        played: row.played,
        wins: row.wins,
        draws: row.draws,
        losses: row.losses,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        fetchedAt,
      },
    ]
  })

type SquadPlayer = { playerId: string; fullName: string }

const findScorerPlayer = (squadPlayers: SquadPlayer[], exactMatches: Map<string, string>, fullName: string): string | null => {
  const exact = exactMatches.get(normalizeName(fullName))
  if (exact) return exact
  const compatible = R.unique(squadPlayers.filter((player) => areNamesCompatible(player.fullName, fullName)).map((player) => player.playerId))

  return compatible.length === 1 ? (compatible[0] ?? null) : null
}

const readSquadPlayers = async (transaction: Transaction, seasonId: string): Promise<SquadPlayer[]> =>
  await transaction
    .select({ playerId: players.id, fullName: players.fullName })
    .from(seasonSquads)
    .innerJoin(seasonTeams, eq(seasonTeams.id, seasonSquads.seasonTeamId))
    .innerJoin(players, eq(players.id, seasonSquads.playerId))
    .where(eq(seasonTeams.seasonId, seasonId))

const indexUniqueNames = (rows: SquadPlayer[]): Map<string, string> => {
  const groups = R.groupBy(rows, (row) => normalizeName(row.fullName))

  return new Map(
    Object.entries(groups).flatMap(([name, group]) => {
      const uniquePlayers = R.unique(group.map((row) => row.playerId))

      return uniquePlayers.length === 1 && uniquePlayers[0] ? [[name, uniquePlayers[0]] as const] : []
    }),
  )
}

export const replaceSnapshots = async (transaction: Transaction, bundle: EditionBundle, seasonId: string, teams: SeasonTeamLookup): Promise<void> => {
  const fetchedAt = new Date()
  const jointRows = bundle.year === CURRENT_SEASON_YEAR ? standingRows(bundle.page.jointStandings, JOINT_PHASE_PREFIX, seasonId, teams, fetchedAt) : []
  const rows = R.uniqueBy([...standingRows(bundle.page.standings, '', seasonId, teams, fetchedAt), ...jointRows], (row) => `${row.phase}|${row.seasonTeamId}`)
  await transaction.delete(fmfStandings).where(eq(fmfStandings.seasonId, seasonId))
  await inChunks(rows, async (chunk) => transaction.insert(fmfStandings).values(chunk))
  const squadPlayers = await readSquadPlayers(transaction, seasonId)
  const playersByName = indexUniqueNames(squadPlayers)
  await transaction.delete(fmfTopScorers).where(eq(fmfTopScorers.seasonId, seasonId))
  const scorerRows = bundle.page.topScorers.map((scorer) => ({
    seasonId,
    playerId: findScorerPlayer(squadPlayers, playersByName, scorer.fullName),
    fullName: scorer.fullName,
    nickname: scorer.nickname,
    clubName: scorer.clubName,
    goals: scorer.goals,
    fetchedAt,
  }))
  await inChunks(scorerRows, async (chunk) => transaction.insert(fmfTopScorers).values(chunk))
}
