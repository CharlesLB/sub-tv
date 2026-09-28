import * as R from 'remeda'
import type { Database } from '../../../../src/lib/db/connection'
import type { syncIssueEnum } from '../../../../src/lib/db/schema'

const INSERT_CHUNK_SIZE = 300

export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0]

export type SyncIssueType = (typeof syncIssueEnum.enumValues)[number]

export const SYNC_ISSUE = {
  ARTILHARIA_DIVERGENTE: 'artilharia_divergente',
  SUMULA_ILEGIVEL: 'sumula_ilegivel',
  ESTRUTURA_PAGINA_MUDOU: 'estrutura_pagina_mudou',
} as const satisfies Record<string, SyncIssueType>

export type ImportIssue = {
  type: SyncIssueType
  matchId: string | null
  playerId: string | null
  details: Record<string, unknown>
}

export const createIssue = (type: SyncIssueType, details: Record<string, unknown>, references: { matchId?: string; playerId?: string } = {}): ImportIssue => ({
  type,
  matchId: references.matchId ?? null,
  playerId: references.playerId ?? null,
  details,
})

export const inChunks = async <Row>(rows: Row[], insertChunk: (chunk: Row[]) => Promise<unknown>): Promise<void> => {
  await R.chunk(rows, INSERT_CHUNK_SIZE).reduce<Promise<void>>(async (previous, chunk) => {
    await previous
    await insertChunk(chunk)
  }, Promise.resolve())
}

export const inChunksReturning = async <Row, Result>(rows: Row[], insertChunk: (chunk: Row[]) => Promise<Result[]>): Promise<Result[]> =>
  await R.chunk(rows, INSERT_CHUNK_SIZE).reduce<Promise<Result[]>>(async (previous, chunk) => [...(await previous), ...(await insertChunk(chunk))], Promise.resolve([]))

export const mostFrequent = <Value>(values: Value[]): Value | null => {
  const counts = R.pipe(
    values,
    R.groupBy((value) => String(value)),
    R.values(),
    R.sortBy([(group) => group.length, 'desc']),
  )

  return counts[0]?.[0] ?? null
}
