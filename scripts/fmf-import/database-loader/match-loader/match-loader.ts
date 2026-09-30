import { getTableColumns, inArray, type SQL, sql } from 'drizzle-orm'
import { matches, matchOfficials } from '../../../../src/lib/db/schema'
import { MATCH_STATUS } from '../../../../src/modules/championships/lib/match-status/match-status'
import type { TableMatch } from '../../competition-page/table-tab-parser/table-tab-parser'
import { type EditionBundle, type LoadedSumula, sumulaOfMatch } from '../../edition-bundle/edition-bundle'
import { SIDE } from '../../sumula/sumula-types/sumula-types'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import { createIssue, type ImportIssue, inChunks, inChunksReturning, SYNC_ISSUE, type Transaction } from '../database-context/database-context'
import { adoptNarratedMatches } from '../narrated-match-adoption/narrated-match-adoption'

const OPERATOR_OWNED_STATUSES = [MATCH_STATUS.LIVE, MATCH_STATUS.FINISHED, MATCH_STATUS.POSTPONED, MATCH_STATUS.CANCELLED]
const operatorOwnedStatusList = OPERATOR_OWNED_STATUSES.map((status) => `'${status}'`).join(', ')
const SAO_PAULO_OFFSET = '-03:00'
const DEFAULT_KICKOFF_TIME = '00:00'

export type LoadedMatch = { matchId: string; tableMatch: TableMatch; sumula: LoadedSumula | undefined; homeSeasonTeamId: string; awaySeasonTeamId: string }

type MatchLoadResult = { loadedMatches: LoadedMatch[]; issues: ImportIssue[] }

const isWalkover = (sumula: LoadedSumula | undefined): boolean => {
  const parsed = sumula?.parsed
  if (!parsed || parsed.goals.length > 0) return false
  const sidesWithPlayers = new Set(parsed.players.map((player) => player.side))
  const totalScore = (parsed.header.homeScore ?? 0) + (parsed.header.awayScore ?? 0)

  return totalScore > 0 && (!sidesWithPlayers.has(SIDE.HOME) || !sidesWithPlayers.has(SIDE.AWAY))
}

const kickoffOf = (tableMatch: TableMatch, sumula: LoadedSumula | undefined): Date | null => {
  const date = tableMatch.date ?? sumula?.parsed?.header.date ?? null
  const time = tableMatch.time ?? sumula?.parsed?.header.time ?? DEFAULT_KICKOFF_TIME

  return date ? new Date(`${date}T${time}:00${SAO_PAULO_OFFSET}`) : null
}

const buildMatchRow = (seasonId: string, tableMatch: TableMatch, sumula: LoadedSumula | undefined, homeSeasonTeamId: string, awaySeasonTeamId: string) => {
  const header = sumula?.parsed?.header
  const homeScore = tableMatch.homeScore ?? header?.homeScore ?? null
  const awayScore = tableMatch.awayScore ?? header?.awayScore ?? null
  const hasScore = homeScore !== null && awayScore !== null
  const status = isWalkover(sumula) ? MATCH_STATUS.WALKOVER : hasScore ? MATCH_STATUS.FINISHED : MATCH_STATUS.SCHEDULED

  return {
    seasonId,
    fmfMatchId: sumula?.reference.fmfMatchId ?? null,
    matchNumber: tableMatch.matchNumber,
    phase: tableMatch.phase,
    round: tableMatch.round,
    homeTeamId: homeSeasonTeamId,
    awayTeamId: awaySeasonTeamId,
    kickoffAt: kickoffOf(tableMatch, sumula),
    venue: tableMatch.venue ?? header?.venue ?? null,
    city: tableMatch.city,
    status,
    homeScore,
    awayScore,
    homeScoreHt: header?.homeScoreHalfTime ?? null,
    awayScoreHt: header?.awayScoreHalfTime ?? null,
    homePenalties: header?.homePenalties ?? null,
    awayPenalties: header?.awayPenalties ?? null,
    addedTime1t: header?.addedTimeFirstHalf ?? null,
    addedTime2t: header?.addedTimeSecondHalf ?? null,
    sumulaUrl: tableMatch.sumulaUrl,
    sumulaRevision: sumula?.reference.revision ?? 0,
    sumulaHash: sumula?.sha256 ?? null,
    sumulaProcessedAt: sumula?.parsed ? new Date() : null,
  }
}

const FMF_OWNED_COLUMNS = ['round', 'home_team_id', 'away_team_id', 'kickoff_at', 'venue', 'city', 'sumula_url', 'sumula_revision'] as const

const SUMULA_DERIVED_COLUMNS = ['home_score_ht', 'away_score_ht', 'home_penalties', 'away_penalties', 'added_time_1t', 'added_time_2t', 'sumula_hash', 'sumula_processed_at'] as const

const sameSumulaCondition = 'excluded.sumula_url is not distinct from matches.sumula_url'

const propertyByColumnName = new Map(Object.entries(getTableColumns(matches)).map(([property, column]) => [column.name, property]))

const assignment = (columnName: string, expression: string): [string, SQL] => [propertyByColumnName.get(columnName) ?? columnName, sql.raw(expression)]

const excludedAssignments: Record<string, SQL> = Object.fromEntries([
  ...FMF_OWNED_COLUMNS.map((column) => assignment(column, `excluded.${column}`)),
  ...SUMULA_DERIVED_COLUMNS.map((column) => assignment(column, `case when ${sameSumulaCondition} then coalesce(excluded.${column}, matches.${column}) else excluded.${column} end`)),
  assignment('fmf_match_id', 'coalesce(excluded.fmf_match_id, matches.fmf_match_id)'),
  assignment('home_score', 'coalesce(excluded.home_score, matches.home_score)'),
  assignment('away_score', 'coalesce(excluded.away_score, matches.away_score)'),
  assignment('status', `case when excluded.home_score is null and matches.status in (${operatorOwnedStatusList}) then matches.status else excluded.status end`),
])

const replaceOfficials = async (transaction: Transaction, loadedMatches: LoadedMatch[]): Promise<void> => {
  const matchIds = loadedMatches.map((loaded) => loaded.matchId)
  if (matchIds.length > 0) await transaction.delete(matchOfficials).where(inArray(matchOfficials.matchId, matchIds))
  const rows = loadedMatches.flatMap((loaded) => loaded.tableMatch.officials.map((official) => ({ matchId: loaded.matchId, role: official.role, name: official.name })))
  await inChunks(rows, async (chunk) => transaction.insert(matchOfficials).values(chunk).onConflictDoNothing())
}

export const upsertMatches = async (transaction: Transaction, bundle: EditionBundle, seasonId: string, teams: SeasonTeamLookup): Promise<MatchLoadResult> => {
  const candidates = bundle.page.matches.map((tableMatch) => ({
    tableMatch,
    sumula: sumulaOfMatch(bundle, tableMatch.sumulaUrl),
    homeSeasonTeamId: teams.get(tableMatch.home.crestId)?.seasonTeamId ?? '',
    awaySeasonTeamId: teams.get(tableMatch.away.crestId)?.seasonTeamId ?? '',
  }))

  const invalid = candidates.filter((candidate) => !candidate.homeSeasonTeamId || !candidate.awaySeasonTeamId || candidate.homeSeasonTeamId === candidate.awaySeasonTeamId)
  const valid = candidates.filter((candidate) => !invalid.includes(candidate))

  const issues = invalid.map((candidate) =>
    createIssue(SYNC_ISSUE.ESTRUTURA_PAGINA_MUDOU, { motivo: 'jogo_com_times_invalidos', fase: candidate.tableMatch.phase, jogo: candidate.tableMatch.matchNumber }),
  )

  await adoptNarratedMatches(transaction, seasonId, valid)

  const insertedRows = await inChunksReturning(valid, async (chunk) =>
    transaction
      .insert(matches)
      .values(chunk.map((candidate) => buildMatchRow(seasonId, candidate.tableMatch, candidate.sumula, candidate.homeSeasonTeamId, candidate.awaySeasonTeamId)))
      .onConflictDoUpdate({ target: [matches.seasonId, matches.phase, matches.matchNumber], set: { ...excludedAssignments, updatedAt: sql`now()` } })
      .returning({ id: matches.id, phase: matches.phase, matchNumber: matches.matchNumber }),
  )

  const matchIds = new Map(insertedRows.map((row) => [`${row.phase}|${row.matchNumber}`, row.id]))
  const loadedMatches = valid.map((candidate) => ({ ...candidate, matchId: matchIds.get(`${candidate.tableMatch.phase}|${candidate.tableMatch.matchNumber}`) ?? '' }))
  await replaceOfficials(transaction, loadedMatches)

  return { loadedMatches, issues }
}
