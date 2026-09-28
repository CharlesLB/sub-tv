import 'server-only'
import { and, eq } from 'drizzle-orm'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { db, tables } from '@/lib/db'
import { toPersistedClock } from '../live-clock/live-clock'
import { DATA_SOURCE, GOAL_TYPE, LIVE_EVENT_TYPE, type LiveClock, MATCH_PERIOD, MATCH_STATUS, type MatchStatus, type Side } from '../live-match/live-match'
import { applyLineupSwap, findEventByKey, findExistingByClientId, findLineupRow, revertLineupSwap, type Transaction } from './live-lineup-rows'
import { finalizeFinishedMatch, type SeasonTouch } from './match-finalization/match-finalization'

const PLAYER_NOT_IN_MATCH = 'Este atleta não está na escalação desta partida.'
const MATCH_NOT_FOUND = 'Partida não encontrada.'
const GOAL_NOT_FOUND = 'Gol não encontrado para vincular a assistência.'
const SCORER_CANNOT_ASSIST = 'Autor do gol não leva a assistência.'
const EDITABLE_STATUSES: readonly MatchStatus[] = [MATCH_STATUS.SCHEDULED, MATCH_STATUS.LIVE, MATCH_STATUS.FINISHED]

type EventPeriod = typeof MATCH_PERIOD.FIRST_HALF | typeof MATCH_PERIOD.HALF_TIME | typeof MATCH_PERIOD.SECOND_HALF | typeof MATCH_PERIOD.FULL_TIME

type RecordedEvent = {
  matchId: string
  clientId: string
  type: typeof LIVE_EVENT_TYPE.GOAL | typeof LIVE_EVENT_TYPE.YELLOW_CARD | typeof LIVE_EVENT_TYPE.RED_CARD
  side: Side
  period: EventPeriod
  minute: number | null
  playerId: string
  fromSecondYellow: boolean
}

type Substitution = { matchId: string; clientId: string; side: Side; period: EventPeriod; minute: number | null; playerInId: string; playerOutId: string; pitchPoint: { x: number; y: number } | null }

const statusForClock = (clock: LiveClock, current: MatchStatus): MatchStatus => {
  if (!EDITABLE_STATUSES.includes(current)) return current
  if (clock.period === MATCH_PERIOD.BEFORE_START) return current
  if (clock.period === MATCH_PERIOD.FULL_TIME) return MATCH_STATUS.FINISHED

  return MATCH_STATUS.LIVE
}

const insertEvent = async (event: RecordedEvent, operator: string): Promise<ActionResult<{ id: string }>> => {
  const lineupRow = await findLineupRow(db, event.matchId, event.playerId)
  if (!lineupRow || lineupRow.side !== event.side) return fail(PLAYER_NOT_IN_MATCH)

  const [inserted] = await db
    .insert(tables.matchEvents)
    .values({
      matchId: event.matchId,
      clientId: event.clientId,
      side: event.side,
      type: event.type,
      period: event.period,
      minute: event.minute,
      playerId: event.playerId,
      goalType: event.type === LIVE_EVENT_TYPE.GOAL ? GOAL_TYPE.NORMAL : null,
      fromSecondYellow: event.type === LIVE_EVENT_TYPE.RED_CARD && event.fromSecondYellow,
      source: DATA_SOURCE.LIVE,
      createdBy: operator,
    })
    .onConflictDoNothing({ target: tables.matchEvents.clientId })
    .returning({ id: tables.matchEvents.id })

  if (inserted) return ok(inserted)

  const existing = await findExistingByClientId(db, event.clientId)

  return existing ? ok(existing) : fail(MATCH_NOT_FOUND)
}

const insertSubstitution = async (substitution: Substitution, operator: string): Promise<ActionResult<{ id: string }>> =>
  db.transaction(async (transaction: Transaction) => {
    const existing = await findExistingByClientId(transaction, substitution.clientId)
    if (existing) return ok(existing)

    const [playerIn, playerOut] = await Promise.all([
      findLineupRow(transaction, substitution.matchId, substitution.playerInId),
      findLineupRow(transaction, substitution.matchId, substitution.playerOutId),
    ])

    if (!playerIn || !playerOut || playerIn.side !== substitution.side || playerOut.side !== substitution.side) return fail(PLAYER_NOT_IN_MATCH)

    await applyLineupSwap(transaction, { playerIn, playerOut, pitchPoint: substitution.pitchPoint })

    const [inserted] = await transaction
      .insert(tables.matchEvents)
      .values({
        matchId: substitution.matchId,
        clientId: substitution.clientId,
        side: substitution.side,
        type: LIVE_EVENT_TYPE.SUBSTITUTION,
        period: substitution.period,
        minute: substitution.minute,
        playerId: substitution.playerInId,
        playerOutId: substitution.playerOutId,
        source: DATA_SOURCE.LIVE,
        createdBy: operator,
      })
      .returning({ id: tables.matchEvents.id })

    return inserted ? ok(inserted) : fail(MATCH_NOT_FOUND)
  })

const markEventDeleted = async (matchId: string, eventKey: string): Promise<ActionResult<{ id: string } | null>> =>
  db.transaction(async (transaction: Transaction) => {
    const event = await findEventByKey(transaction, matchId, eventKey)
    if (!event || event.deletedAt) return ok(null)

    await transaction.update(tables.matchEvents).set({ deletedAt: new Date() }).where(eq(tables.matchEvents.id, event.id))

    if (event.type === LIVE_EVENT_TYPE.SUBSTITUTION && event.source === DATA_SOURCE.LIVE && event.playerId && event.playerOutId) {
      await revertLineupSwap(transaction, matchId, event.playerId, event.playerOutId)
    }

    return ok({ id: event.id })
  })

type WithSeasonTouch<Data> = { result: ActionResult<Data>; seasonTouch: SeasonTouch | null }

const finalizeAfter = async <Data>(matchId: string, result: ActionResult<Data>): Promise<WithSeasonTouch<Data>> => ({
  result,
  seasonTouch: result.ok ? await finalizeFinishedMatch(matchId) : null,
})

const recordEvent = async (event: RecordedEvent, operator: string): Promise<WithSeasonTouch<{ id: string }>> => await finalizeAfter(event.matchId, await insertEvent(event, operator))

const substitute = async (substitution: Substitution, operator: string): Promise<WithSeasonTouch<{ id: string }>> =>
  await finalizeAfter(substitution.matchId, await insertSubstitution(substitution, operator))

const revertEvent = async (matchId: string, eventKey: string): Promise<WithSeasonTouch<{ id: string } | null>> => await finalizeAfter(matchId, await markEventDeleted(matchId, eventKey))

const attachAssist = async (matchId: string, goalKey: string, assistPlayerId: string | null): Promise<ActionResult<{ id: string }>> => {
  const { matchEvents } = tables
  const goal = await findEventByKey(db, matchId, goalKey)
  if (!goal || goal.type !== LIVE_EVENT_TYPE.GOAL) return fail(GOAL_NOT_FOUND)
  if (assistPlayerId && assistPlayerId === goal.playerId) return fail(SCORER_CANNOT_ASSIST)

  if (assistPlayerId) {
    const lineupRow = await findLineupRow(db, matchId, assistPlayerId)
    if (!lineupRow || lineupRow.side !== goal.side) return fail(PLAYER_NOT_IN_MATCH)
  }

  await db.update(matchEvents).set({ assistPlayerId }).where(eq(matchEvents.id, goal.id))

  return ok({ id: goal.id })
}

const updateClock = async (matchId: string, clock: LiveClock): Promise<ActionResult<{ seasonId: string; statusChanged: boolean; seasonTouch: SeasonTouch | null }>> => {
  const { matches } = tables
  const [match] = await db.select({ seasonId: matches.seasonId, status: matches.status }).from(matches).where(eq(matches.id, matchId)).limit(1)
  if (!match) return fail(MATCH_NOT_FOUND)

  const status = statusForClock(clock, match.status)
  const persistedClock = toPersistedClock(clock)
  await db.update(matches).set({ liveClock: persistedClock, status }).where(eq(matches.id, matchId))

  const statusChanged = status !== match.status
  const seasonTouch = statusChanged && status === MATCH_STATUS.FINISHED ? await finalizeFinishedMatch(matchId) : null

  return ok({ seasonId: match.seasonId, statusChanged, seasonTouch })
}

const updatePosition = async (matchId: string, playerId: string, pitchX: number, pitchY: number): Promise<ActionResult<{ playerId: string }>> => {
  const { matchLineups } = tables

  const [updated] = await db
    .update(matchLineups)
    .set({ pitchX, pitchY })
    .where(and(eq(matchLineups.matchId, matchId), eq(matchLineups.playerId, playerId)))
    .returning({ playerId: matchLineups.playerId })

  return updated ? ok(updated) : fail(PLAYER_NOT_IN_MATCH)
}

export const liveService = { recordEvent, substitute, revertEvent, attachAssist, updateClock, updatePosition }
