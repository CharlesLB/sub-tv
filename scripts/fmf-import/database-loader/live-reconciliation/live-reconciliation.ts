import { and, eq, inArray, isNull, or } from 'drizzle-orm'
import * as R from 'remeda'
import { matchEvents } from '../../../../src/lib/db/schema'
import { type ImportIssue, type Transaction, createIssue } from '../database-context/database-context'

const LIVE_SOURCE = 'ao_vivo'
const FMF_SOURCE = 'fmf'
const MINUTE_TOLERANCE = 3
const UNPAIRED_LIVE_EVENT_ISSUE = 'evento_ao_vivo_sem_par'

export type ComparableEvent = { id: string; matchId: string; type: string; playerId: string | null; playerOutId: string | null; minute: number | null }

export type ReconciliationPair = { liveEventId: string; fmfEventId: string }

const minutesAgree = (first: number | null, second: number | null): boolean =>
  first === null || second === null ? first === second : Math.abs(first - second) <= MINUTE_TOLERANCE

const eventsAgree = (live: ComparableEvent, fmf: ComparableEvent): boolean =>
  live.matchId === fmf.matchId && live.type === fmf.type && live.playerId === fmf.playerId && live.playerOutId === fmf.playerOutId && minutesAgree(live.minute, fmf.minute)

export const pairLiveEvents = (liveEvents: ComparableEvent[], fmfEvents: ComparableEvent[]): ReconciliationPair[] =>
  liveEvents.reduce<ReconciliationPair[]>((pairs, live) => {
    const usedIds = new Set(pairs.map((pair) => pair.fmfEventId))
    const candidates = fmfEvents.filter((fmf) => !usedIds.has(fmf.id) && eventsAgree(live, fmf))
    const closest = R.sortBy(candidates, (fmf) => Math.abs((fmf.minute ?? 0) - (live.minute ?? 0)))[0]

    return closest ? [...pairs, { liveEventId: live.id, fmfEventId: closest.id }] : pairs
  }, [])

const comparableColumns = {
  id: matchEvents.id,
  matchId: matchEvents.matchId,
  type: matchEvents.type,
  playerId: matchEvents.playerId,
  playerOutId: matchEvents.playerOutId,
  minute: matchEvents.minute,
}

export const reconcileLiveEvents = async (transaction: Transaction, matchIds: string[]): Promise<ImportIssue[]> => {
  if (matchIds.length === 0) return []
  const liveEvents = await transaction
    .select(comparableColumns)
    .from(matchEvents)
    .where(
      and(
        inArray(matchEvents.matchId, matchIds),
        eq(matchEvents.source, LIVE_SOURCE),
        isNull(matchEvents.deletedAt),
        or(isNull(matchEvents.supersededAt), isNull(matchEvents.reconciledWithId)),
      ),
    )
  if (liveEvents.length === 0) return []
  const liveMatchIds = R.unique(liveEvents.map((event) => event.matchId))
  const fmfEvents = await transaction
    .select(comparableColumns)
    .from(matchEvents)
    .where(and(inArray(matchEvents.matchId, liveMatchIds), eq(matchEvents.source, FMF_SOURCE)))
  const fmfMatchIds = new Set(fmfEvents.map((event) => event.matchId))
  const pairs = pairLiveEvents(liveEvents, fmfEvents)
  const pairedIds = new Set(pairs.map((pair) => pair.liveEventId))
  const reconciledAt = new Date()
  await pairs.reduce<Promise<void>>(async (previous, pair) => {
    await previous
    await transaction.update(matchEvents).set({ supersededAt: reconciledAt, reconciledWithId: pair.fmfEventId }).where(eq(matchEvents.id, pair.liveEventId))
  }, Promise.resolve())
  const unpaired = liveEvents.filter((event) => !pairedIds.has(event.id) && fmfMatchIds.has(event.matchId))
  if (unpaired.length > 0) {
    await transaction
      .update(matchEvents)
      .set({ supersededAt: null, reconciledWithId: null })
      .where(inArray(matchEvents.id, unpaired.map((event) => event.id)))
  }

  return unpaired.map((event) => createIssue(UNPAIRED_LIVE_EVENT_ISSUE, { evento: event.type, minuto: event.minute, eventoId: event.id }, { matchId: event.matchId }))
}
