import 'server-only'
import { db } from '@/lib/db'
import { runFmfSync, type SyncSummary } from './fmf-sync/fmf-sync'
import { selectRawStorage, TEMPORARY_RAW_STORAGE } from './raw-storage/raw-storage'

export type { SyncSummary }

export const runNightlyFmfSync = async (): Promise<SyncSummary> => {
  selectRawStorage(TEMPORARY_RAW_STORAGE)

  return await runFmfSync(db)
}
