import { requestFmf } from '../http-client/http-client'
import { isMarkedMissing, markMissing, readStoredFile, storeFile, sumulaRelativePath } from '../raw-storage/raw-storage'
import type { SumulaReference } from '../sumula-reference/sumula-reference'

const PROGRESS_BATCH_SIZE = 25

export type DownloadOutcome = { reference: SumulaReference; relativePath: string; status: 'cached' | 'downloaded' | 'missing' }

const downloadSumula = async (reference: SumulaReference, shouldRefresh: boolean): Promise<DownloadOutcome> => {
  const relativePath = sumulaRelativePath(reference.fileName)
  if (!shouldRefresh && (await readStoredFile(relativePath))) return { reference, relativePath, status: 'cached' }
  if (!shouldRefresh && (await isMarkedMissing(relativePath))) return { reference, relativePath, status: 'missing' }
  const result = await requestFmf({ url: reference.url })

  if (!result.found) {
    await markMissing(relativePath)

    return { reference, relativePath, status: 'missing' }
  }

  await storeFile(relativePath, result.body)

  return { reference, relativePath, status: 'downloaded' }
}

export const downloadSumulas = async (label: string, references: SumulaReference[], shouldRefresh: boolean): Promise<DownloadOutcome[]> =>
  await references.reduce<Promise<DownloadOutcome[]>>(async (previous, reference, index) => {
    const outcomes = [...(await previous), await downloadSumula(reference, shouldRefresh)]

    if ((index + 1) % PROGRESS_BATCH_SIZE === 0 || index + 1 === references.length) {
      const downloadedCount = outcomes.filter((outcome) => outcome.status === 'downloaded').length
      const missingCount = outcomes.filter((outcome) => outcome.status === 'missing').length
      console.info(`${label}: súmulas ${index + 1}/${references.length} (baixadas ${downloadedCount}, ausentes ${missingCount})`)
    }

    return outcomes
  }, Promise.resolve([]))
