import 'server-only'
import { and, asc, desc, eq, inArray, isNull, or } from 'drizzle-orm'
import * as R from 'remeda'
import { db, tables } from '@/lib/db'
import { toTitleCase } from '@/modules/championships'
import { DATA_SOURCE, SIDE, type LivePlayerVM, type SeasonNumbersVM, type Side } from '../live-match/live-match'
import { layoutStarters, type PitchPoint } from '../pitch-layout/pitch-layout'

const CURIOSITIES_PER_PLAYER = 2
const EMPTY_SEASON_NUMBERS: SeasonNumbersVM = { goals: 0, assists: 0, yellowCards: 0, games: 0 }

type LineupRow = Awaited<ReturnType<typeof selectLineupRows>>[number]

const selectLineupRows = (matchId: string) => {
  const { matchLineups, players } = tables

  return db
    .select({
      playerId: matchLineups.playerId,
      side: matchLineups.side,
      shirtNumber: matchLineups.shirtNumber,
      isStarter: matchLineups.isStarter,
      isCaptain: matchLineups.isCaptain,
      pitchX: matchLineups.pitchX,
      pitchY: matchLineups.pitchY,
      positionOverride: matchLineups.positionOverride,
      source: matchLineups.source,
      fullName: players.fullName,
      nickname: players.nickname,
      displayName: players.displayName,
      position: players.position,
      preferredFoot: players.preferredFoot,
    })
    .from(matchLineups)
    .innerJoin(players, eq(players.id, matchLineups.playerId))
    .where(eq(matchLineups.matchId, matchId))
    .orderBy(asc(matchLineups.shirtNumber))
}

const preferEditorialRows = (rows: LineupRow[]): LineupRow[] => {
  const editorialRows = rows.filter((row) => row.source !== DATA_SOURCE.FMF)

  return editorialRows.length > 0 ? editorialRows : rows
}

const readSeasonNumbers = async (seasonId: string, playerIds: string[]): Promise<Record<string, SeasonNumbersVM>> => {
  const { playerSeasonStats } = tables
  const rows = await db
    .select({
      playerId: playerSeasonStats.playerId,
      goals: playerSeasonStats.goals,
      assists: playerSeasonStats.assists,
      yellowCards: playerSeasonStats.yellowCards,
      games: playerSeasonStats.games,
    })
    .from(playerSeasonStats)
    .where(and(eq(playerSeasonStats.seasonId, seasonId), inArray(playerSeasonStats.playerId, playerIds)))

  return R.mapValues(
    R.groupBy(rows, (row) => row.playerId),
    (playerRows) => ({
      goals: R.sumBy(playerRows, (row) => row.goals),
      assists: R.sumBy(playerRows, (row) => row.assists),
      yellowCards: R.sumBy(playerRows, (row) => row.yellowCards),
      games: R.sumBy(playerRows, (row) => row.games),
    }),
  )
}

const readCuriosities = async (seasonId: string, playerIds: string[]): Promise<Record<string, string[]>> => {
  const { curiosities } = tables
  const rows = await db
    .select({ playerId: curiosities.playerId, text: curiosities.text })
    .from(curiosities)
    .where(and(inArray(curiosities.playerId, playerIds), or(isNull(curiosities.seasonId), eq(curiosities.seasonId, seasonId))))
    .orderBy(desc(curiosities.isHighlight), asc(curiosities.sortOrder), desc(curiosities.notedOn))

  return R.mapValues(
    R.groupBy(
      rows.flatMap((row) => (row.playerId ? [{ playerId: row.playerId, text: row.text }] : [])),
      (row) => row.playerId,
    ),
    (playerRows) => playerRows.slice(0, CURIOSITIES_PER_PLAYER).map((row) => row.text),
  )
}

const LETTER = /\p{L}/u

const readableName = (name: string | null): string | null => (name && LETTER.test(name) ? toTitleCase(name) : null)

const shortNameOf = (row: LineupRow): string => {
  const nickname = readableName(row.displayName) ?? readableName(row.nickname)
  if (nickname) return nickname

  return toTitleCase(row.fullName.split(/\s+/)[0] ?? row.fullName)
}

const pitchPointsOf = (rows: LineupRow[], side: Side): Record<string, PitchPoint> => {
  const starters = rows.filter((row) => row.isStarter)
  const computed = layoutStarters(
    starters.map((row) => ({ key: row.playerId, shirtNumber: row.shirtNumber, position: row.positionOverride ?? row.position })),
    side === SIDE.HOME,
  )

  return R.fromEntries(
    starters.flatMap((row): [string, PitchPoint][] => {
      const stored = row.pitchX !== null && row.pitchY !== null ? { x: row.pitchX, y: row.pitchY } : null
      const point = stored ?? computed[row.playerId]

      return point ? [[row.playerId, point]] : []
    }),
  )
}

export const readLivePlayers = async (matchId: string, seasonId: string): Promise<LivePlayerVM[]> => {
  const allRows = await selectLineupRows(matchId)
  const rowsBySide = R.groupBy(allRows, (row) => row.side)
  const sides = [SIDE.HOME, SIDE.AWAY] as const
  const chosenRows = sides.map((side) => ({ side, rows: preferEditorialRows(rowsBySide[side] ?? []) }))
  const playerIds = chosenRows.flatMap(({ rows }) => rows.map((row) => row.playerId))
  if (playerIds.length === 0) return []

  const [seasonNumbers, curiosities] = await Promise.all([readSeasonNumbers(seasonId, playerIds), readCuriosities(seasonId, playerIds)])

  return chosenRows.flatMap(({ side, rows }) => {
    const points = pitchPointsOf(rows, side)

    return rows.map((row) => ({
      playerId: row.playerId,
      side,
      shirtNumber: row.shirtNumber,
      name: toTitleCase(row.fullName),
      shortName: shortNameOf(row),
      nickname: readableName(row.displayName),
      position: row.positionOverride ?? row.position,
      preferredFoot: row.preferredFoot,
      isStarter: row.isStarter,
      isCaptain: row.isCaptain,
      pitchPoint: points[row.playerId] ?? null,
      season: seasonNumbers[row.playerId] ?? EMPTY_SEASON_NUMBERS,
      curiosities: curiosities[row.playerId] ?? [],
    }))
  })
}
