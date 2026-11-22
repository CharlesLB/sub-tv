import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { syncRuns } from '@/lib/db/schema'
import { startSyncRun } from './sync-run'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1_000

const insertRunningRun = async (kind: string, startedAt: Date): Promise<string> => {
  const [run] = await db.insert(syncRuns).values({ kind, status: 'rodando', startedAt }).returning({ id: syncRuns.id })
  if (!run) throw new Error('insert returned no row')

  return run.id
}

const runById = async (runId: string) => (await db.select().from(syncRuns).where(eq(syncRuns.id, runId)))[0]

describe('startSyncRun', () => {
  it('marks a run of the same kind stuck in rodando for too long as falhou', async () => {
    const kind = `noturno-${randomUUID()}`
    const stuckRunId = await insertRunningRun(kind, new Date(Date.now() - TWO_DAYS_MS))

    const newRunId = await startSyncRun(db, kind)

    expect(await runById(stuckRunId)).toMatchObject({ status: 'falhou', finishedAt: expect.any(Date), error: expect.any(String) })
    expect(await runById(newRunId)).toMatchObject({ status: 'rodando' })
  })

  it('leaves a recent run and runs of another kind untouched', async () => {
    const kind = `noturno-${randomUUID()}`
    const recentRunId = await insertRunningRun(kind, new Date())
    const otherKindRunId = await insertRunningRun(`carga-${randomUUID()}`, new Date(Date.now() - TWO_DAYS_MS))

    await startSyncRun(db, kind)

    expect(await runById(recentRunId)).toMatchObject({ status: 'rodando', finishedAt: null })
    expect(await runById(otherKindRunId)).toMatchObject({ status: 'rodando', finishedAt: null })
  })
})
