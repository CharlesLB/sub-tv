import 'server-only'
import { and, eq, or } from 'drizzle-orm'
import { type db, type Transaction, tables } from '@/lib/db'

type DatabaseExecutor = typeof db | Transaction

type LineupRow = { id: string; side: 'home' | 'away'; isStarter: boolean; pitchX: number | null; pitchY: number | null }

export const findLineupRow = async (executor: DatabaseExecutor, matchId: string, playerId: string): Promise<LineupRow | null> => {
  const { matchLineups } = tables

  const [row] = await executor
    .select({ id: matchLineups.id, side: matchLineups.side, isStarter: matchLineups.isStarter, pitchX: matchLineups.pitchX, pitchY: matchLineups.pitchY })
    .from(matchLineups)
    .where(and(eq(matchLineups.matchId, matchId), eq(matchLineups.playerId, playerId)))
    .limit(1)

  return row ?? null
}

export const findExistingByClientId = async (executor: DatabaseExecutor, matchId: string, clientId: string): Promise<{ id: string } | null> => {
  const { matchEvents } = tables

  const [row] = await executor
    .select({ id: matchEvents.id })
    .from(matchEvents)
    .where(and(eq(matchEvents.matchId, matchId), eq(matchEvents.clientId, clientId)))
    .limit(1)

  return row ?? null
}

export const findEventByKey = async (executor: DatabaseExecutor, matchId: string, eventKey: string) => {
  const { matchEvents } = tables

  const [row] = await executor
    .select({
      id: matchEvents.id,
      type: matchEvents.type,
      side: matchEvents.side,
      source: matchEvents.source,
      playerId: matchEvents.playerId,
      playerOutId: matchEvents.playerOutId,
      deletedAt: matchEvents.deletedAt,
    })
    .from(matchEvents)
    .where(and(eq(matchEvents.matchId, matchId), or(eq(matchEvents.clientId, eventKey), eq(matchEvents.id, eventKey))))
    .limit(1)

  return row ?? null
}

const setLineupRow = (executor: DatabaseExecutor, rowId: string, values: { isStarter: boolean; pitchX: number | null; pitchY: number | null }) =>
  executor.update(tables.matchLineups).set(values).where(eq(tables.matchLineups.id, rowId))

export const applyLineupSwap = async (executor: DatabaseExecutor, swap: { playerIn: LineupRow; playerOut: LineupRow; pitchPoint: { x: number; y: number } | null }): Promise<void> => {
  const { playerIn, playerOut, pitchPoint } = swap
  await setLineupRow(executor, playerIn.id, { isStarter: true, pitchX: pitchPoint?.x ?? playerOut.pitchX, pitchY: pitchPoint?.y ?? playerOut.pitchY })
  await setLineupRow(executor, playerOut.id, { isStarter: false, pitchX: playerIn.pitchX, pitchY: playerIn.pitchY })
}

export const revertLineupSwap = async (executor: DatabaseExecutor, matchId: string, playerInId: string, playerOutId: string): Promise<boolean> => {
  const [playerIn, playerOut] = await Promise.all([findLineupRow(executor, matchId, playerInId), findLineupRow(executor, matchId, playerOutId)])
  if (!playerIn?.isStarter || !playerOut || playerOut.isStarter) return false

  await setLineupRow(executor, playerOut.id, { isStarter: true, pitchX: playerIn.pitchX, pitchY: playerIn.pitchY })
  await setLineupRow(executor, playerIn.id, { isStarter: false, pitchX: playerOut.pitchX, pitchY: playerOut.pitchY })

  return true
}
