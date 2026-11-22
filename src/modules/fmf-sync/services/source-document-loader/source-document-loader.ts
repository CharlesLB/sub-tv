import { sourceDocuments } from '@/lib/db/schema'
import { inChunks, type Transaction } from '../database-context/database-context'
import type { EditionBundle } from '../edition-bundle/edition-bundle'
import type { LoadedMatch } from '../match-loader/match-loader'
import { toBlobUrl } from '../raw-storage/raw-storage'

const DOCUMENT_KIND = { COMPETITION_PAGE: 'pagina_competicao', SUMULA: 'sumula' } as const

export const recordSourceDocuments = async (transaction: Transaction, bundle: EditionBundle, seasonId: string, loadedMatches: LoadedMatch[]): Promise<void> => {
  const pageDocument = {
    url: `${bundle.pageUrl}#edicao=${bundle.editionId}`,
    kind: DOCUMENT_KIND.COMPETITION_PAGE,
    sha256: bundle.pageSha256,
    blobUrl: toBlobUrl(bundle.pageRelativePath),
    seasonId,
    matchId: null,
  }

  const sumulaDocuments = loadedMatches.flatMap((loaded) =>
    loaded.sumula?.sha256
      ? [
          {
            url: loaded.sumula.reference.url,
            kind: DOCUMENT_KIND.SUMULA,
            sha256: loaded.sumula.sha256,
            blobUrl: toBlobUrl(loaded.sumula.relativePath),
            seasonId,
            matchId: loaded.matchId,
          },
        ]
      : [],
  )

  await inChunks([pageDocument, ...sumulaDocuments], async (chunk) =>
    transaction
      .insert(sourceDocuments)
      .values(chunk)
      .onConflictDoNothing({ target: [sourceDocuments.url, sourceDocuments.sha256] }),
  )
}
