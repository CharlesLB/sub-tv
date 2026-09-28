import { eq, inArray } from 'drizzle-orm'
import * as R from 'remeda'
import type { Database } from '../../../src/lib/db/connection'
import { competitions, matches, seasons } from '../../../src/lib/db/schema'
import { COMPETITION_SOURCES } from '../constants/fmf-sources'
import { type EditionCounters, loadEdition } from '../database-loader/edition-loader/edition-loader'
import { finishSyncRun, type RunSummary, startSyncRun } from '../database-loader/sync-run/sync-run'
import { readEditionBundle } from '../edition-bundle/edition-bundle'
import { downloadEditionPages, type EditionPageFile } from '../edition-pages/edition-pages'
import { downloadSumulas } from '../sumula-downloader/sumula-downloader'
import type { SumulaReference } from '../sumula-reference/sumula-reference'

const NIGHTLY_KIND = 'noturno'
const YEAR_PATTERN = /(\d{4})(?!.*\d{4})/

export type EditionSyncSummary = { label: string; seasonId: string; matches: number; sumulasProcessed: number; retifications: number; issuesByType: Record<string, number> }

export type SyncSummary = { runId: string; editions: EditionSyncSummary[]; sumulasDownloaded: number; sumulasUnchanged: number; touchedSeasonIds: string[] }

type KnownSumula = { fmfMatchId: number | null; sumulaUrl: string | null; sumulaProcessedAt: Date | null }

const yearOfLabel = (label: string): number | null => {
  const match = YEAR_PATTERN.exec(label)

  return match ? Number(match[1]) : null
}

const readCurrentSeasons = async (database: Database): Promise<{ slug: string; year: number }[]> =>
  await database.select({ slug: competitions.slug, year: seasons.year }).from(seasons).innerJoin(competitions, eq(competitions.id, seasons.competitionId)).where(eq(seasons.isCurrent, true))

const readKnownSumulas = async (database: Database, fmfMatchIds: number[]): Promise<Map<number, KnownSumula>> => {
  if (fmfMatchIds.length === 0) return new Map()

  const rows = await database
    .select({ fmfMatchId: matches.fmfMatchId, sumulaUrl: matches.sumulaUrl, sumulaProcessedAt: matches.sumulaProcessedAt })
    .from(matches)
    .where(inArray(matches.fmfMatchId, fmfMatchIds))

  return new Map(rows.map((row) => [row.fmfMatchId ?? 0, row]))
}

const isAlreadyProcessed = (known: KnownSumula | undefined, reference: SumulaReference): boolean => known !== undefined && known.sumulaUrl === reference.url && known.sumulaProcessedAt !== null

const runSequentially = async <Item, Result>(items: readonly Item[], work: (item: Item) => Promise<Result>): Promise<Result[]> =>
  await items.reduce<Promise<Result[]>>(async (previous, item) => [...(await previous), await work(item)], Promise.resolve([]))

type EditionOutcome = { counters: EditionCounters; label: string; downloaded: number; unchanged: number }

const syncEdition = async (database: Database, runId: string, pageFile: EditionPageFile): Promise<EditionOutcome | null> => {
  const pageOnly = await readEditionBundle(pageFile, { parseSumulas: false, shouldLoadSumula: () => false })
  if (!pageOnly) return null
  const references = [...pageOnly.sumulas.values()].map((sumula) => sumula.reference)

  const known = await readKnownSumulas(
    database,
    references.map((reference) => reference.fmfMatchId),
  )

  const pending = references.filter((reference) => !isAlreadyProcessed(known.get(reference.fmfMatchId), reference))
  await downloadSumulas(pageOnly.page.label, pending, false)
  const toLoad = new Set(pending.map((reference) => reference.fmfMatchId))
  const bundle = await readEditionBundle(pageFile, { parseSumulas: true, shouldLoadSumula: (reference) => toLoad.has(reference.fmfMatchId) })
  if (!bundle) return null
  const counters = await loadEdition(database, runId, bundle, { incremental: true })

  return { counters, label: bundle.page.label, downloaded: toLoad.size, unchanged: references.length - toLoad.size }
}

const sumCounters = (outcomes: EditionOutcome[]): RunSummary => ({
  newMatches: R.sumBy(outcomes, (outcome) => outcome.counters.newMatches),
  sumulasProcessed: R.sumBy(outcomes, (outcome) => outcome.counters.sumulasProcessed),
  retifications: R.sumBy(outcomes, (outcome) => outcome.counters.retifications),
  errors: R.sumBy(outcomes, (outcome) => outcome.counters.errors),
})

export const runFmfSync = async (database: Database): Promise<SyncSummary> => {
  const runId = await startSyncRun(database, NIGHTLY_KIND)
  const progress: { outcomes: EditionOutcome[] } = { outcomes: [] }

  try {
    const knownSlugs = new Set(COMPETITION_SOURCES.map((source) => source.slug))
    const currentSeasons = (await readCurrentSeasons(database)).filter((season) => knownSlugs.has(season.slug))
    const currentSlugs = new Set(currentSeasons.map((season) => season.slug))
    const minimumYear = Math.min(...currentSeasons.map((season) => season.year))
    const sources = COMPETITION_SOURCES.filter((source) => currentSlugs.has(source.slug))

    const pageFiles = (
      await runSequentially(sources, async (source) => downloadEditionPages(source.pageId, { refresh: true, selectEdition: (edition) => (yearOfLabel(edition.label) ?? 0) >= minimumYear }))
    ).flat()

    await runSequentially(pageFiles, async (pageFile) => {
      const outcome = await syncEdition(database, runId, pageFile)

      if (outcome) {
        console.info(`${outcome.label}: ${outcome.downloaded} súmulas novas ou retificadas, ${outcome.unchanged} sem mudança`)
        progress.outcomes = [...progress.outcomes, outcome]
      }
    })

    await finishSyncRun(database, runId, sumCounters(progress.outcomes), null)
  } catch (error) {
    await finishSyncRun(database, runId, sumCounters(progress.outcomes), error instanceof Error ? error.message : String(error))

    throw error
  }

  return {
    runId,
    editions: progress.outcomes.map((outcome) => ({
      label: outcome.label,
      seasonId: outcome.counters.seasonId,
      matches: outcome.counters.newMatches,
      sumulasProcessed: outcome.counters.sumulasProcessed,
      retifications: outcome.counters.retifications,
      issuesByType: outcome.counters.issuesByType,
    })),
    sumulasDownloaded: R.sumBy(progress.outcomes, (outcome) => outcome.downloaded),
    sumulasUnchanged: R.sumBy(progress.outcomes, (outcome) => outcome.unchanged),
    touchedSeasonIds: R.unique(progress.outcomes.map((outcome) => outcome.counters.seasonId)),
  }
}
