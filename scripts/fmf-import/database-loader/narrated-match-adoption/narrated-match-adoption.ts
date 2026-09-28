import { eq } from 'drizzle-orm'
import * as R from 'remeda'
import { matches } from '../../../../src/lib/db/schema'
import type { TableMatch } from '../../competition-page/table-tab-parser/table-tab-parser'
import type { Transaction } from '../database-context/database-context'

const SAO_PAULO_OFFSET_MILLISECONDS = 3 * 60 * 60 * 1_000
const ISO_DATE_LENGTH = 10

export type AdoptionCandidate = { tableMatch: TableMatch; homeSeasonTeamId: string; awaySeasonTeamId: string }

type ExistingMatch = { id: string; phase: string | null; matchNumber: number | null; homeTeamId: string; awayTeamId: string; kickoffAt: Date | null }

const localDateOf = (instant: Date | null): string | null =>
  instant ? new Date(instant.getTime() - SAO_PAULO_OFFSET_MILLISECONDS).toISOString().slice(0, ISO_DATE_LENGTH) : null

const tableKey = (phase: string | null, matchNumber: number | null): string => `${phase}|${matchNumber}`

export const pairNarratedMatches = (candidates: AdoptionCandidate[], existing: ExistingMatch[]): { matchId: string; candidate: AdoptionCandidate }[] => {
  const takenKeys = new Set(existing.filter((match) => match.matchNumber !== null).map((match) => tableKey(match.phase, match.matchNumber)))
  const orphans = existing.filter((match) => match.matchNumber === null)
  const pairs = candidates
    .filter((candidate) => !takenKeys.has(tableKey(candidate.tableMatch.phase, candidate.tableMatch.matchNumber)))
    .flatMap((candidate) => {
      const orphan = orphans.find(
        (match) =>
          match.homeTeamId === candidate.homeSeasonTeamId && match.awayTeamId === candidate.awaySeasonTeamId && localDateOf(match.kickoffAt) === candidate.tableMatch.date,
      )

      return orphan ? [{ matchId: orphan.id, candidate }] : []
    })

  return R.uniqueBy(pairs, (pair) => pair.matchId)
}

export const adoptNarratedMatches = async (transaction: Transaction, seasonId: string, candidates: AdoptionCandidate[]): Promise<number> => {
  const existing = await transaction
    .select({ id: matches.id, phase: matches.phase, matchNumber: matches.matchNumber, homeTeamId: matches.homeTeamId, awayTeamId: matches.awayTeamId, kickoffAt: matches.kickoffAt })
    .from(matches)
    .where(eq(matches.seasonId, seasonId))
  const pairs = pairNarratedMatches(candidates, existing)
  await pairs.reduce<Promise<void>>(async (previous, pair) => {
    await previous
    await transaction.update(matches).set({ phase: pair.candidate.tableMatch.phase, matchNumber: pair.candidate.tableMatch.matchNumber }).where(eq(matches.id, pair.matchId))
  }, Promise.resolve())

  return pairs.length
}
