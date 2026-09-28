import { and, eq, inArray, sql } from 'drizzle-orm'
import * as R from 'remeda'
import { matchLineups, seasonSquads } from '../../../../src/lib/db/schema'
import type { Side, SumulaPlayer } from '../../sumula/sumula-types/sumula-types'
import { hasDigits, normalizeName, sanitizePersonName } from '../../text-normalization/text-normalization'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import { createIssue, type ImportIssue, inChunks, mostFrequent, SYNC_ISSUE, type Transaction } from '../database-context/database-context'
import type { LoadedMatch } from '../match-loader/match-loader'
import { type IdentifiedPlayer, identityOf, resolvePlayerIds } from '../player-identity/player-identity'

const FMF_SOURCE = 'fmf' as const

export type MatchPlayerLookup = Map<string, Map<string, string>>

export const lineupKey = (side: Side, shirtNumber: number): string => `${side}|${shirtNumber}`

const seasonTeamOf = (loaded: LoadedMatch, side: Side): string => (side === 'home' ? loaded.homeSeasonTeamId : loaded.awaySeasonTeamId)

const nameKey = (seasonTeamId: string, fullName: string): string => `${seasonTeamId}|${normalizeName(fullName)}`

const sanitizePlayer = (player: SumulaPlayer): SumulaPlayer => {
  const nickname = sanitizePersonName(player.nickname ?? '')
  const fullName = sanitizePersonName(player.fullName) || nickname

  return { ...player, nickname: nickname || null, fullName }
}

const sanitizedNameIssues = (loadedMatches: LoadedMatch[]): ImportIssue[] =>
  loadedMatches.flatMap((loaded) =>
    (loaded.sumula?.parsed?.players ?? [])
      .filter((player) => hasDigits(player.fullName) || hasDigits(player.nickname))
      .map((player) => createIssue(SYNC_ISSUE.SUMULA_ILEGIVEL, { motivo: 'nome_com_digitos_removidos', lado: player.side, numero: player.shirtNumber }, { matchId: loaded.matchId })),
  )

const buildCandidates = (loadedMatches: LoadedMatch[], teams: SeasonTeamLookup): { candidates: IdentifiedPlayer[]; issues: ImportIssue[] } => {
  const clubBySeasonTeam = new Map([...teams.values()].map((team) => [team.seasonTeamId, team.clubId]))

  const entries = loadedMatches.flatMap((loaded) =>
    (loaded.sumula?.parsed?.players ?? []).map(sanitizePlayer).map((player) => {
      const seasonTeamId = seasonTeamOf(loaded, player.side)

      return { loaded, player, seasonTeamId, clubId: clubBySeasonTeam.get(seasonTeamId) ?? '' }
    }),
  )

  const knownCbfIds = new Map(entries.flatMap((entry) => (entry.player.cbfId ? [[nameKey(entry.seasonTeamId, entry.player.fullName), entry.player.cbfId] as const] : [])))

  const candidates = entries.map((entry) => {
    const cbfId = entry.player.cbfId ?? knownCbfIds.get(nameKey(entry.seasonTeamId, entry.player.fullName)) ?? null

    return { ...entry, cbfId, identity: identityOf(cbfId, entry.clubId, entry.player.fullName) }
  })

  const issues = R.pipe(
    candidates.filter((candidate) => candidate.cbfId === null),
    R.groupBy((candidate) => candidate.loaded.matchId),
    R.values(),
    R.map((group) =>
      createIssue(
        SYNC_ISSUE.SUMULA_ILEGIVEL,
        {
          motivo: 'jogador_sem_cbf',
          informativo: true,
          jogadores: group.map((candidate) => ({ lado: candidate.player.side, numero: candidate.player.shirtNumber, nome: candidate.player.fullName })),
        },
        { matchId: group[0]?.loaded.matchId ?? '' },
      ),
    ),
  )

  return { candidates, issues: [...issues, ...sanitizedNameIssues(loadedMatches)] }
}

const dedupeLineups = (candidates: IdentifiedPlayer[]): { unique: IdentifiedPlayer[]; issues: ImportIssue[] } => {
  const unique = R.pipe(
    candidates,
    R.uniqueBy((candidate) => `${candidate.loaded.matchId}|${lineupKey(candidate.player.side, candidate.player.shirtNumber)}`),
    R.uniqueBy((candidate) => `${candidate.loaded.matchId}|${candidate.identity}`),
  )

  const issues = candidates
    .filter((candidate) => !unique.includes(candidate))
    .map((candidate) =>
      createIssue(SYNC_ISSUE.SUMULA_ILEGIVEL, { motivo: 'numero_ou_jogador_duplicado', lado: candidate.player.side, numero: candidate.player.shirtNumber }, { matchId: candidate.loaded.matchId }),
    )

  return { unique, issues }
}

const upsertSquads = async (transaction: Transaction, candidates: IdentifiedPlayer[], playerIds: Map<string, string>): Promise<void> => {
  const squads = R.pipe(
    candidates,
    R.groupBy((candidate) => `${candidate.seasonTeamId}|${playerIds.get(candidate.identity) ?? ''}`),
    R.values(),
    R.map((group) => ({
      seasonTeamId: group[0]?.seasonTeamId ?? '',
      playerId: playerIds.get(group[0]?.identity ?? '') ?? '',
      usualShirtNumber: mostFrequent(group.map((candidate) => candidate.player.shirtNumber)),
    })),
  )

  await inChunks(squads, async (chunk) =>
    transaction
      .insert(seasonSquads)
      .values(chunk)
      .onConflictDoUpdate({ target: [seasonSquads.seasonTeamId, seasonSquads.playerId], set: { usualShirtNumber: sql`excluded.usual_shirt_number`, updatedAt: sql`now()` } }),
  )
}

export const loadLineups = async (transaction: Transaction, loadedMatches: LoadedMatch[], teams: SeasonTeamLookup): Promise<{ lookup: MatchPlayerLookup; issues: ImportIssue[] }> => {
  const built = buildCandidates(loadedMatches, teams)
  const deduped = dedupeLineups(built.candidates)
  const playerIds = await resolvePlayerIds(transaction, deduped.unique)
  await upsertSquads(transaction, deduped.unique, playerIds)
  const parsedMatchIds = loadedMatches.filter((loaded) => loaded.sumula?.parsed).map((loaded) => loaded.matchId)
  if (parsedMatchIds.length > 0) await transaction.delete(matchLineups).where(and(inArray(matchLineups.matchId, parsedMatchIds), eq(matchLineups.source, FMF_SOURCE)))

  const lineupRows = R.uniqueBy(
    deduped.unique.map((candidate) => ({
      matchId: candidate.loaded.matchId,
      side: candidate.player.side,
      playerId: playerIds.get(candidate.identity) ?? '',
      shirtNumber: candidate.player.shirtNumber,
      isStarter: candidate.player.isStarter,
      isCaptain: candidate.player.isCaptain,
      source: FMF_SOURCE,
    })),
    (row) => `${row.matchId}|${row.playerId}`,
  )

  await inChunks(lineupRows, async (chunk) => transaction.insert(matchLineups).values(chunk).onConflictDoNothing())

  const lookup = new Map(
    R.pipe(
      lineupRows,
      R.groupBy((row) => row.matchId),
      R.entries(),
      R.map(([matchId, rows]): [string, Map<string, string>] => [matchId, new Map(rows.map((row) => [lineupKey(row.side, row.shirtNumber), row.playerId]))]),
    ),
  )

  return { lookup, issues: [...built.issues, ...deduped.issues] }
}
