import 'server-only'
import { db } from '@/lib/db'
import { selectRawStorage, TEMPORARY_RAW_STORAGE } from '../../../../../scripts/fmf-import/raw-storage/raw-storage'
import { runFmfSync, type SyncSummary } from '../../../../../scripts/fmf-import/sync/fmf-sync'

export type { SyncSummary }

export const runNightlyFmfSync = async (): Promise<SyncSummary> => {
  selectRawStorage(TEMPORARY_RAW_STORAGE)

  return await runFmfSync(db)
}
