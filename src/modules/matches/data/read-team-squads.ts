import 'server-only'
import { and, eq, inArray } from 'drizzle-orm'
import * as R from 'remeda'
import { db, tables } from '@/lib/db'
import type { PlayerPosition } from '../pitch-layout/pitch-layout'
import { assignShirtNumbers } from '../squad-shirts/squad-shirts'

export type SquadMember = {
  playerId: string
  seasonTeamId: string
  shirtNumber: number
  name: string
  nickname: string | null
  position: PlayerPosition | null
  starts: number
}

const byShirtThenName = (members: SquadMember[]): SquadMember[] =>
  R.sortBy(
    members,
    (member) => member.shirtNumber,
    (member) => member.name,
  )

export const readTeamSquads = async (seasonTeamIds: string[]): Promise<Record<string, SquadMember[]>> => {
  if (seasonTeamIds.length === 0) return {}

  const { seasonSquads, players, playerSeasonStats } = tables
  const rows = await db
    .select({
      playerId: players.id,
      seasonTeamId: seasonSquads.seasonTeamId,
      usualShirtNumber: seasonSquads.usualShirtNumber,
      fullName: players.fullName,
      nickname: players.nickname,
      displayName: players.displayName,
      position: players.position,
      starts: playerSeasonStats.starts,
    })
    .from(seasonSquads)
    .innerJoin(players, eq(players.id, seasonSquads.playerId))
    .leftJoin(playerSeasonStats, and(eq(playerSeasonStats.playerId, seasonSquads.playerId), eq(playerSeasonStats.seasonTeamId, seasonSquads.seasonTeamId)))
    .where(and(inArray(seasonSquads.seasonTeamId, seasonTeamIds), eq(seasonSquads.isActive, true)))

  const rowsByTeam = R.groupBy(rows, (row) => row.seasonTeamId)

  return R.mapValues(rowsByTeam, (teamRows) => {
    const shirtNumbers = assignShirtNumbers(
      teamRows.map((row) => ({ playerId: row.playerId, usualShirtNumber: row.usualShirtNumber, starts: row.starts ?? 0, name: row.fullName })),
    )

    return byShirtThenName(
      teamRows.map((row) => ({
        playerId: row.playerId,
        seasonTeamId: row.seasonTeamId,
        shirtNumber: shirtNumbers[row.playerId] ?? 0,
        name: row.fullName,
        nickname: row.displayName ?? row.nickname,
        position: row.position,
        starts: row.starts ?? 0,
      })),
    )
  })
}
