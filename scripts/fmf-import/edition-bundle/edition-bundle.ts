import { type CompetitionPage, parseCompetitionPage } from '../competition-page/competition-page-parser/competition-page-parser'
import { buildCompetitionPageUrl, COMPETITION_SOURCES, type CompetitionSource } from '../constants/fmf-sources'
import { decodeUtf8 } from '../http-client/http-client'
import { computeSha256, readStoredFile, type StoredPage, sumulaRelativePath } from '../raw-storage/raw-storage'
import { parseSumulaPdf } from '../sumula/sumula-parser/sumula-parser'
import type { ParsedSumula } from '../sumula/sumula-types/sumula-types'
import { readSumulaReference, type SumulaReference } from '../sumula-reference/sumula-reference'

const YEAR_PATTERN = /(\d{4})(?!.*\d{4})/

export type LoadedSumula = {
  reference: SumulaReference
  relativePath: string
  sha256: string | null
  parsed: ParsedSumula | null
  failure: string | null
  skipped: boolean
}

export type BundleOptions = { parseSumulas: boolean; shouldLoadSumula: (reference: SumulaReference) => boolean }

const loadEverySumula = (): boolean => true

export type EditionBundle = {
  source: CompetitionSource
  editionId: number
  year: number
  pageUrl: string
  pageRelativePath: string
  pageSha256: string
  page: CompetitionPage
  sumulas: Map<number, LoadedSumula>
}

const describeError = (error: unknown): string => (error instanceof Error ? error.message : String(error))

const loadSumula = async (reference: SumulaReference, options: BundleOptions): Promise<LoadedSumula> => {
  const relativePath = sumulaRelativePath(reference.fileName)
  if (!options.shouldLoadSumula(reference)) return { reference, relativePath, sha256: null, parsed: null, failure: null, skipped: true }
  const bytes = await readStoredFile(relativePath)
  if (!bytes) return { reference, relativePath, sha256: null, parsed: null, failure: 'arquivo da súmula não disponível', skipped: false }
  if (!options.parseSumulas) return { reference, relativePath, sha256: computeSha256(bytes), parsed: null, failure: null, skipped: false }

  try {
    return { reference, relativePath, sha256: computeSha256(bytes), parsed: await parseSumulaPdf(bytes), failure: null, skipped: false }
  } catch (error) {
    return { reference, relativePath, sha256: computeSha256(bytes), parsed: null, failure: describeError(error), skipped: false }
  }
}

export const readEditionBundle = async (storedPage: StoredPage, options: Partial<BundleOptions> = {}): Promise<EditionBundle | null> => {
  const bundleOptions: BundleOptions = { parseSumulas: options.parseSumulas ?? true, shouldLoadSumula: options.shouldLoadSumula ?? loadEverySumula }
  const source = COMPETITION_SOURCES.find((candidate) => candidate.pageId === storedPage.pageId)
  const pageBytes = await readStoredFile(storedPage.relativePath)
  if (!source || !pageBytes) return null
  const page = parseCompetitionPage(decodeUtf8(pageBytes))
  const year = Number(YEAR_PATTERN.exec(page.label)?.[1] ?? Number.NaN)
  if (!Number.isInteger(year)) throw new Error(`não foi possível ler o ano da edição "${page.label}"`)

  const references = page.matches.flatMap((match) => {
    const reference = match.sumulaUrl ? readSumulaReference(match.sumulaUrl) : null

    return reference ? [reference] : []
  })

  const sumulas = await Promise.all(references.map(async (reference) => await loadSumula(reference, bundleOptions)))

  return {
    source,
    editionId: storedPage.editionId,
    year,
    pageUrl: buildCompetitionPageUrl(storedPage.pageId),
    pageRelativePath: storedPage.relativePath,
    pageSha256: computeSha256(pageBytes),
    page,
    sumulas: new Map(sumulas.map((sumula) => [sumula.reference.fmfMatchId, sumula])),
  }
}

export const sumulaOfMatch = (bundle: EditionBundle, sumulaUrl: string | null): LoadedSumula | undefined => {
  const reference = sumulaUrl ? readSumulaReference(sumulaUrl) : null

  return reference ? bundle.sumulas.get(reference.fmfMatchId) : undefined
}
