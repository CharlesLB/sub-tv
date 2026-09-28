import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import * as tables from '@/lib/db/schema'

type MatchStatus = (typeof tables.matchStatusEnum.enumValues)[number]

type EventType = (typeof tables.eventTypeEnum.enumValues)[number]

export type SeededSeason = { seasonId: string; homeTeamId: string; awayTeamId: string; homePlayerId: string; awayPlayerId: string; homeBenchPlayerId: string }

const firstRow = <Row>(rows: Row[]): Row => {
  const [row] = rows
  if (!row) throw new Error('insert returned no row')

  return row
}

const insertTeam = async (seasonId: string, shortName: string): Promise<string> => {
  const club = firstRow(await db.insert(tables.clubs).values({ shortName }).returning({ id: tables.clubs.id }))

  return firstRow(await db.insert(tables.seasonTeams).values({ seasonId, clubId: club.id }).returning({ id: tables.seasonTeams.id })).id
}

const insertPlayer = async (fullName: string): Promise<string> => firstRow(await db.insert(tables.players).values({ fullName }).returning({ id: tables.players.id })).id

export const seedSeason = async (): Promise<SeededSeason> => {
  const competition = firstRow(
    await db
      .insert(tables.competitions)
      .values({ name: 'Mineiro Sub-14', slug: `mineiro-sub-14-${randomUUID()}`, category: 'sub14', division: 'primeira' })
      .returning({ id: tables.competitions.id }),
  )

  const season = firstRow(await db.insert(tables.seasons).values({ competitionId: competition.id, year: 2026, label: '2026' }).returning({ id: tables.seasons.id }))

  const [homeTeamId, awayTeamId, homePlayerId, awayPlayerId, homeBenchPlayerId] = await Promise.all([
    insertTeam(season.id, 'Clube Azul'),
    insertTeam(season.id, 'Clube Verde'),
    insertPlayer('Artur Mendes'),
    insertPlayer('Bruno Carvalho'),
    insertPlayer('Caio Ribeiro'),
  ])

  return { seasonId: season.id, homeTeamId, awayTeamId, homePlayerId, awayPlayerId, homeBenchPlayerId }
}

export const seedMatch = async (season: SeededSeason, status: MatchStatus, matchNumber: number): Promise<string> => {
  const match = firstRow(
    await db
      .insert(tables.matches)
      .values({ seasonId: season.seasonId, homeTeamId: season.homeTeamId, awayTeamId: season.awayTeamId, status, matchNumber, homeScore: 0, awayScore: 0 })
      .returning({ id: tables.matches.id }),
  )

  await db.insert(tables.matchLineups).values([
    { matchId: match.id, side: 'home', playerId: season.homePlayerId, shirtNumber: 10, isStarter: true, pitchX: 50, pitchY: 50 },
    { matchId: match.id, side: 'home', playerId: season.homeBenchPlayerId, shirtNumber: 17, isStarter: false },
    { matchId: match.id, side: 'away', playerId: season.awayPlayerId, shirtNumber: 9, isStarter: true, pitchX: 50, pitchY: 50 },
  ])

  return match.id
}

export const seedEvent = async (matchId: string, type: EventType, playerId: string): Promise<string> =>
  firstRow(
    await db
      .insert(tables.matchEvents)
      .values({ matchId, side: 'home', type, period: '1T', minute: 10, playerId, goalType: type === 'gol' ? 'normal' : null, source: 'ao_vivo' })
      .returning({ id: tables.matchEvents.id }),
  ).id
