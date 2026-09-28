import * as R from 'remeda'
import { createDatabase, createPool } from '../../src/lib/db/connection'
import { COMPETITION_SOURCES } from './constants/fmf-sources'
import { mergeClubAliases } from './database-loader/club-merge/club-merge'
import { type EditionCounters, loadEdition } from './database-loader/edition-loader/edition-loader'
import { scrubPersonalData } from './database-loader/personal-data-scrub/personal-data-scrub'
import { finishSyncRun, type RunSummary, startSyncRun } from './database-loader/sync-run/sync-run'
import { type EditionBundle, readEditionBundle } from './edition-bundle/edition-bundle'
import { downloadEditionPages } from './edition-pages/edition-pages'
import { listStoredPages, type StoredPage } from './raw-storage/raw-storage'
import { downloadSumulas } from './sumula-downloader/sumula-downloader'
import { readSumulaReference } from './sumula-reference/sumula-reference'

const FULL_IMPORT_KIND = 'carga_historica'

const FLAG = {
  ONLY_DOWNLOAD: '--only-download',
  ONLY_LOAD: '--only-load',
  SKIP_SUMULAS: '--skip-sumulas',
  REFRESH: '--refresh',
  EDITION_PREFIX: '--edition=',
} as const

type ImportOptions = { onlyDownload: boolean; onlyLoad: boolean; skipSumulas: boolean; refresh: boolean; editionId: number | null }

const readOptions = (argumentsList: string[]): ImportOptions => {
  const editionArgument = argumentsList.find((argument) => argument.startsWith(FLAG.EDITION_PREFIX))
  const editionId = editionArgument ? Number(editionArgument.slice(FLAG.EDITION_PREFIX.length)) : null
  if (editionId !== null && !Number.isInteger(editionId)) throw new Error(`edição inválida: ${editionArgument}`)

  return {
    onlyDownload: argumentsList.includes(FLAG.ONLY_DOWNLOAD),
    onlyLoad: argumentsList.includes(FLAG.ONLY_LOAD),
    skipSumulas: argumentsList.includes(FLAG.SKIP_SUMULAS),
    refresh: argumentsList.includes(FLAG.REFRESH),
    editionId,
  }
}

const runSequentially = async <Item, Result>(items: readonly Item[], work: (item: Item) => Promise<Result>): Promise<Result[]> =>
  await items.reduce<Promise<Result[]>>(async (previous, item) => [...(await previous), await work(item)], Promise.resolve([]))

const downloadEverything = async (options: ImportOptions): Promise<void> => {
  const pageFiles = (
    await runSequentially(
      COMPETITION_SOURCES,
      async (source) => await downloadEditionPages(source.pageId, { refresh: options.refresh, selectEdition: (edition) => options.editionId === null || edition.editionId === options.editionId }),
    )
  ).flat()

  if (options.skipSumulas) return

  await runSequentially(pageFiles, async (pageFile) => {
    const bundle = await readEditionBundle(pageFile, { parseSumulas: false })
    if (!bundle) return

    const references = bundle.page.matches.flatMap((match) => {
      const reference = match.sumulaUrl ? readSumulaReference(match.sumulaUrl) : null

      return reference ? [reference] : []
    })

    await downloadSumulas(bundle.page.label, references, options.refresh)
  })
}

const readBundlesInOrder = async (options: ImportOptions): Promise<EditionBundle[]> => {
  const storedPages = (await listStoredPages()).filter((page: StoredPage) => options.editionId === null || page.editionId === options.editionId)
  const bundles = await runSequentially(storedPages, async (page) => await readEditionBundle(page, { parseSumulas: !options.skipSumulas }))

  return R.sortBy(
    bundles.filter(R.isNonNullish),
    (bundle) => bundle.year,
    (bundle) => bundle.source.pageId,
  )
}

const describeCounters = (bundle: EditionBundle, counters: EditionCounters): string =>
  `${bundle.page.label} (d=${bundle.source.pageId}, edição ${bundle.editionId}): ${counters.newMatches} jogos, ${counters.sumulasProcessed} súmulas, ${counters.retifications} retificadas, pendências ${JSON.stringify(counters.issuesByType)}`

const sumSummaries = (summaries: RunSummary[]): RunSummary =>
  summaries.reduce<RunSummary>(
    (total, summary) => ({
      newMatches: total.newMatches + summary.newMatches,
      sumulasProcessed: total.sumulasProcessed + summary.sumulasProcessed,
      retifications: total.retifications + summary.retifications,
      errors: total.errors + summary.errors,
    }),
    { newMatches: 0, sumulasProcessed: 0, retifications: 0, errors: 0 },
  )

const loadEverything = async (options: ImportOptions): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL é obrigatório para carregar o banco')
  const pool = createPool(databaseUrl)
  const database = createDatabase(pool)
  await mergeClubAliases(database)
  await scrubPersonalData(database)
  const runId = await startSyncRun(database, FULL_IMPORT_KIND)
  const progress: { summaries: RunSummary[] } = { summaries: [] }

  try {
    const bundles = await readBundlesInOrder(options)
    console.info(`carregando ${bundles.length} edições`)

    await runSequentially(bundles, async (bundle) => {
      const counters = await loadEdition(database, runId, bundle)
      console.info(describeCounters(bundle, counters))
      progress.summaries = [...progress.summaries, counters]
    })

    await finishSyncRun(database, runId, sumSummaries(progress.summaries), null)
  } catch (error) {
    await finishSyncRun(database, runId, sumSummaries(progress.summaries), error instanceof Error ? error.message : String(error))

    throw error
  } finally {
    await pool.end()
  }
}

const options = readOptions(process.argv.slice(2))
if (!options.onlyLoad) await downloadEverything(options)
if (!options.onlyDownload) await loadEverything(options)
console.info('carga histórica concluída')
