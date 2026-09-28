import 'server-only'
import { db } from '@/lib/db'
import { TEMPORARY_RAW_STORAGE, selectRawStorage } from '../../../../../scripts/fmf-import/raw-storage/raw-storage'
import { type SyncSummary, runFmfSync } from '../../../../../scripts/fmf-import/sync/fmf-sync'

export type { SyncSummary }

export const runNightlyFmfSync = async (): Promise<SyncSummary> => {
  selectRawStorage(TEMPORARY_RAW_STORAGE)

  return await runFmfSync(db)
}
