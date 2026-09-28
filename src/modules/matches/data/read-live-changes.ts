import 'server-only'
import { type AnyColumn, and, eq, gt, inArray, isNotNull, sql } from 'drizzle-orm'
import { db, tables } from '@/lib/db'
import { parsePersistedClock } from '../live-clock/live-clock'
import { LIVE_EVENT_TYPE, type LiveClock } from '../live-match/live-match'
import type { RemoteEvent, RemotePosition } from '../live-stream/live-stream-messages'

const OVERLAP_SECONDS = 5
const LIVE_EVENT_TYPES = [LIVE_EVENT_TYPE.GOAL, LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.RED_CARD, LIVE_EVENT_TYPE.SUBSTITUTION]

type Versioned<TItem> = { versionKey: string; version: string; updatedMs: number; item: TItem }

export type LiveChanges = {
  events: Versioned<Omit<RemoteEvent, 'seq'>>[]
  positions: Versioned<RemotePosition>[]
  clock: Versioned<LiveClock> | null
}

const versionText = (column: AnyColumn) => sql<string>`${column}::text`

const updatedMsOf = (column: AnyColumn) => sql<number>`floor(extract(epoch from ${column}) * 1000)::float8`

const changedSince = (column: AnyColumn, sinceMs: number) => gt(column, sql`to_timestamp(${sinceMs / 1000}) - make_interval(secs => ${OVERLAP_SECONDS})`)

const readEvents = async (matchId: string, sinceMs: number): Promise<LiveChanges['events']> => {
  const { matchEvents } = tables

  const rows = await db
    .select({
      id: matchEvents.id,
      clientId: matchEvents.clientId,
      side: matchEvents.side,
      type: matchEvents.type,
      period: matchEvents.period,
      minute: matchEvents.minute,
      playerId: matchEvents.playerId,
      playerOutId: matchEvents.playerOutId,
      assistPlayerId: matchEvents.assistPlayerId,
      goalType: matchEvents.goalType,
      fromSecondYellow: matchEvents.fromSecondYellow,
      source: matchEvents.source,
      deletedAt: matchEvents.deletedAt,
      supersededAt: matchEvents.supersededAt,
      version: versionText(matchEvents.updatedAt),
      updatedMs: updatedMsOf(matchEvents.updatedAt),
    })
    .from(matchEvents)
    .where(and(eq(matchEvents.matchId, matchId), inArray(matchEvents.type, LIVE_EVENT_TYPES), changedSince(matchEvents.updatedAt, sinceMs)))

  return rows.map((row) => ({
    versionKey: `event:${row.id}`,
    version: row.version,
    updatedMs: Number(row.updatedMs),
    item: {
      key: row.clientId ?? row.id,
      isActive: row.deletedAt === null && row.supersededAt === null,
      side: row.side,
      type: row.type,
      period: row.period,
      minute: row.minute,
      playerId: row.playerId,
      playerOutId: row.playerOutId,
      assistPlayerId: row.assistPlayerId,
      goalType: row.goalType,
      fromSecondYellow: row.fromSecondYellow,
      source: row.source,
    },
  }))
}

const readPositions = async (matchId: string, sinceMs: number): Promise<LiveChanges['positions']> => {
  const { matchLineups } = tables

  const rows = await db
    .select({
      playerId: matchLineups.playerId,
      pitchX: matchLineups.pitchX,
      pitchY: matchLineups.pitchY,
      version: versionText(matchLineups.updatedAt),
      updatedMs: updatedMsOf(matchLineups.updatedAt),
    })
    .from(matchLineups)
    .where(and(eq(matchLineups.matchId, matchId), isNotNull(matchLineups.pitchX), isNotNull(matchLineups.pitchY), changedSince(matchLineups.updatedAt, sinceMs)))

  return rows.flatMap((row) =>
    row.pitchX !== null && row.pitchY !== null
      ? [{ versionKey: `lineup:${row.playerId}`, version: row.version, updatedMs: Number(row.updatedMs), item: { playerId: row.playerId, x: row.pitchX, y: row.pitchY } }]
      : [],
  )
}

const readClock = async (matchId: string, sinceMs: number): Promise<LiveChanges['clock']> => {
  const { matches } = tables

  const [row] = await db
    .select({ liveClock: matches.liveClock, version: versionText(matches.updatedAt), updatedMs: updatedMsOf(matches.updatedAt) })
    .from(matches)
    .where(and(eq(matches.id, matchId), isNotNull(matches.liveClock), changedSince(matches.updatedAt, sinceMs)))
    .limit(1)

  return row ? { versionKey: 'clock', version: row.version, updatedMs: Number(row.updatedMs), item: parsePersistedClock(row.liveClock) } : null
}

export const readLiveChanges = async (matchId: string, sinceMs: number): Promise<LiveChanges> => {
  const [events, positions, clock] = await Promise.all([readEvents(matchId, sinceMs), readPositions(matchId, sinceMs), readClock(matchId, sinceMs)])

  return { events, positions, clock }
}
