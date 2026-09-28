import { randomUUID } from 'node:crypto'
import { eq, inArray, sql } from 'drizzle-orm'
import * as R from 'remeda'
import { players, seasonSquads, seasonTeams } from '../../../../src/lib/db/schema'
import type { SumulaPlayer } from '../../sumula/sumula-types/sumula-types'
import { normalizeName } from '../../text-normalization/text-normalization'
import { type Transaction, inChunks, inChunksReturning } from '../database-context/database-context'
import type { LoadedMatch } from '../match-loader/match-loader'

const CBF_IDENTITY_PREFIX = 'cbf:'
const NAME_IDENTITY_PREFIX = 'nome:'

export type IdentifiedPlayer = { loaded: LoadedMatch; player: SumulaPlayer; seasonTeamId: string; clubId: string; cbfId: string | null; identity: string }

type ClubPlayerRow = { playerId: string; cbfId: string | null; fullName: string; clubId: string }

export const clubNameKey = (clubId: string, fullName: string): string => `${clubId}|${normalizeName(fullName)}`

export const identityOf = (cbfId: string | null, clubId: string, fullName: string): string =>
  cbfId ? `${CBF_IDENTITY_PREFIX}${cbfId}` : `${NAME_IDENTITY_PREFIX}${clubNameKey(clubId, fullName)}`

const latestAppearances = (candidates: IdentifiedPlayer[]): IdentifiedPlayer[] =>
  R.pipe(
    candidates,
    R.sortBy([(candidate) => candidate.loaded.tableMatch.date ?? '', 'desc']),
    R.uniqueBy((candidate) => candidate.identity),
  )

const upsertCbfPlayers = async (transaction: Transaction, candidates: IdentifiedPlayer[]): Promise<Map<string, string>> => {
  const rows = await inChunksReturning(latestAppearances(candidates), async (chunk) =>
    transaction
      .insert(players)
      .values(chunk.map((candidate) => ({ cbfId: candidate.cbfId, fullName: candidate.player.fullName, nickname: candidate.player.nickname })))
      .onConflictDoUpdate({ target: players.cbfId, set: { fullName: sql`excluded.full_name`, nickname: sql`excluded.nickname`, updatedAt: sql`now()` } })
      .returning({ id: players.id, cbfId: players.cbfId }),
  )

  return new Map(rows.map((row) => [`${CBF_IDENTITY_PREFIX}${row.cbfId ?? ''}`, row.id]))
}

const readClubPlayers = async (transaction: Transaction, clubIds: string[]): Promise<ClubPlayerRow[]> =>
  clubIds.length === 0
    ? []
    : await transaction
        .selectDistinct({ playerId: players.id, cbfId: players.cbfId, fullName: players.fullName, clubId: seasonTeams.clubId })
        .from(players)
        .innerJoin(seasonSquads, eq(seasonSquads.playerId, players.id))
        .innerJoin(seasonTeams, eq(seasonTeams.id, seasonSquads.seasonTeamId))
        .where(inArray(seasonTeams.clubId, clubIds))

const uniqueIndex = (rows: { key: string; playerId: string }[]): Map<string, string> =>
  new Map(
    Object.entries(R.groupBy(rows, (row) => row.key)).flatMap(([key, group]) => {
      const playerIds = R.unique(group.map((row) => row.playerId))

      return playerIds.length === 1 && playerIds[0] ? [[key, playerIds[0]] as const] : []
    }),
  )

const resolveNamelessPlayers = async (transaction: Transaction, candidates: IdentifiedPlayer[], cbfPlayerIds: Map<string, string>): Promise<Map<string, string>> => {
  const clubPlayers = await readClubPlayers(transaction, R.unique(candidates.map((candidate) => candidate.clubId)))
  const cbfByName = uniqueIndex(
    clubPlayers.filter((row) => row.cbfId !== null).map((row) => ({ key: clubNameKey(row.clubId, row.fullName), playerId: row.playerId })),
  )
  const namelessByName = uniqueIndex(clubPlayers.filter((row) => row.cbfId === null).map((row) => ({ key: clubNameKey(row.clubId, row.fullName), playerId: row.playerId })))
  const appearances = latestAppearances(candidates)
  const resolved = appearances.map((candidate) => {
    const key = clubNameKey(candidate.clubId, candidate.player.fullName)
    const existingId = cbfByName.get(key) ?? cbfPlayerIds.get(key) ?? namelessByName.get(key)

    return { candidate, playerId: existingId ?? randomUUID(), isNew: existingId === undefined }
  })
  await inChunks(
    resolved.filter((entry) => entry.isNew),
    async (chunk) =>
      transaction
        .insert(players)
        .values(chunk.map((entry) => ({ id: entry.playerId, cbfId: null, fullName: entry.candidate.player.fullName, nickname: entry.candidate.player.nickname }))),
  )

  return new Map(resolved.map((entry) => [entry.candidate.identity, entry.playerId]))
}

export const resolvePlayerIds = async (transaction: Transaction, candidates: IdentifiedPlayer[]): Promise<Map<string, string>> => {
  const withCbf = candidates.filter((candidate) => candidate.cbfId !== null)
  const cbfPlayerIds = await upsertCbfPlayers(transaction, withCbf)
  const editionCbfByName = new Map(withCbf.map((candidate) => [clubNameKey(candidate.clubId, candidate.player.fullName), cbfPlayerIds.get(candidate.identity) ?? '']))
  const namelessIds = await resolveNamelessPlayers(
    transaction,
    candidates.filter((candidate) => candidate.cbfId === null),
    editionCbfByName,
  )

  return new Map([...cbfPlayerIds, ...namelessIds])
}
