import { and, eq, inArray, isNull, or } from 'drizzle-orm'
import type { Database } from '../../../../src/lib/db/connection'
import { syncIssues, syncRuns } from '../../../../src/lib/db/schema'
import { type ImportIssue, type Transaction, inChunks } from '../database-context/database-context'

const RESOLVED_BY_REIMPORT = 'reimportacao_carga_historica'
const SYNC_STATUS = { RUNNING: 'rodando', SUCCESS: 'sucesso', PARTIAL: 'parcial', FAILED: 'falhou' } as const

export type RunSummary = { newMatches: number; sumulasProcessed: number; retifications: number; errors: number }

export const startSyncRun = async (database: Database, kind: string): Promise<string> => {
  const [run] = await database.insert(syncRuns).values({ kind, status: SYNC_STATUS.RUNNING }).returning({ id: syncRuns.id })
  if (!run) throw new Error('não foi possível registrar a execução em sync_runs')

  return run.id
}

export const finishSyncRun = async (database: Database, runId: string, summary: RunSummary, failure: string | null): Promise<void> => {
  const status = failure ? SYNC_STATUS.FAILED : summary.errors > 0 ? SYNC_STATUS.PARTIAL : SYNC_STATUS.SUCCESS
  await database.update(syncRuns).set({ status, summary, finishedAt: new Date(), error: failure }).where(eq(syncRuns.id, runId))
}

export const replaceSeasonIssues = async (transaction: Transaction, runId: string, seasonId: string, issues: ImportIssue[], touchedMatchIds: string[] | null): Promise<void> => {
  const scope =
    touchedMatchIds === null ? undefined : touchedMatchIds.length === 0 ? isNull(syncIssues.matchId) : or(isNull(syncIssues.matchId), inArray(syncIssues.matchId, touchedMatchIds))
  await transaction
    .update(syncIssues)
    .set({ resolvedAt: new Date(), resolvedBy: RESOLVED_BY_REIMPORT })
    .where(and(eq(syncIssues.seasonId, seasonId), isNull(syncIssues.resolvedAt), scope))
  await inChunks(issues, async (chunk) =>
    transaction.insert(syncIssues).values(
      chunk.map((issue) => ({ syncRunId: runId, seasonId, type: issue.type, matchId: issue.matchId, playerId: issue.playerId, details: issue.details })),
    ),
  )
}
