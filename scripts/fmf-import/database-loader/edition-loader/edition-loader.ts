import * as R from 'remeda'
import type { Database } from '../../../../src/lib/db/connection'
import type { EditionBundle } from '../../edition-bundle/edition-bundle'
import { recalculateImportedSeason } from '../../statistics/season-statistics/season-statistics'
import { compareTopScorers } from '../../statistics/top-scorer-check/top-scorer-check'
import { upsertClubsAndSeasonTeams } from '../club-loader/club-loader'
import { upsertSeason } from '../competition-season-loader/competition-season-loader'
import { createIssue, type ImportIssue, SYNC_ISSUE } from '../database-context/database-context'
import { loadEvents } from '../event-loader/event-loader'
import { upsertMatches } from '../match-loader/match-loader'
import { loadLineups } from '../player-loader/player-loader'
import { replaceSnapshots } from '../snapshot-loader/snapshot-loader'
import { recordSourceDocuments } from '../source-document-loader/source-document-loader'
import { loadStaff } from '../staff-loader/staff-loader'
import { type RunSummary, replaceSeasonIssues } from '../sync-run/sync-run'

export type EditionCounters = RunSummary & { seasonId: string; issuesByType: Record<string, number> }

export type LoadScope = { incremental: boolean }

const countByType = (issues: ImportIssue[]): Record<string, number> => R.countBy(issues, (issue) => issue.type)

export const loadEdition = async (database: Database, runId: string, bundle: EditionBundle, scope: LoadScope = { incremental: false }): Promise<EditionCounters> =>
  await database.transaction(async (transaction) => {
    const seasonId = await upsertSeason(transaction, bundle)
    const teams = await upsertClubsAndSeasonTeams(transaction, bundle, seasonId)
    const matchResult = await upsertMatches(transaction, bundle, seasonId, teams)
    const lineupResult = await loadLineups(transaction, matchResult.loadedMatches, teams)
    const staffLookup = await loadStaff(transaction, matchResult.loadedMatches, teams)
    const eventIssues = await loadEvents(transaction, matchResult.loadedMatches, lineupResult.lookup, staffLookup)
    await replaceSnapshots(transaction, bundle, seasonId, teams)
    await recordSourceDocuments(transaction, bundle, seasonId, matchResult.loadedMatches)
    await recalculateImportedSeason(transaction, seasonId)

    const unreadable = matchResult.loadedMatches.flatMap((loaded) =>
      loaded.sumula && !loaded.sumula.parsed && !loaded.sumula.skipped
        ? [createIssue(SYNC_ISSUE.SUMULA_ILEGIVEL, { motivo: loaded.sumula.failure, arquivo: loaded.sumula.reference.fileName }, { matchId: loaded.matchId })]
        : [],
    )

    const parseWarnings = matchResult.loadedMatches.flatMap((loaded) =>
      (loaded.sumula?.parsed?.warnings ?? []).map((warning) => createIssue(SYNC_ISSUE.SUMULA_ILEGIVEL, { motivo: warning, arquivo: loaded.sumula?.reference.fileName }, { matchId: loaded.matchId })),
    )

    const scorerIssues = await compareTopScorers(transaction, seasonId)
    const issues = [...matchResult.issues, ...unreadable, ...parseWarnings, ...lineupResult.issues, ...eventIssues, ...scorerIssues]
    const processedSumulas = matchResult.loadedMatches.filter((loaded) => loaded.sumula?.parsed)
    await replaceSeasonIssues(transaction, runId, seasonId, issues, scope.incremental ? processedSumulas.map((loaded) => loaded.matchId) : null)

    return {
      seasonId,
      newMatches: matchResult.loadedMatches.length,
      sumulasProcessed: processedSumulas.length,
      retifications: processedSumulas.filter((loaded) => (loaded.sumula?.reference.revision ?? 0) > 0).length,
      errors: unreadable.length,
      issuesByType: countByType(issues),
    }
  })
