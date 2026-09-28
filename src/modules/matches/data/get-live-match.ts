import 'server-only'
import { and, asc, eq, inArray, isNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import { teamBadgeColumns, toTeamBadge, toTitleCase } from '@/modules/championships'
import { INITIAL_LIVE_CLOCK, parsePersistedClock } from '../live-clock/live-clock'
import {
  DATA_SOURCE,
  HALF_LENGTH_MINUTES,
  LIVE_EVENT_TYPE,
  MATCH_PERIOD,
  MATCH_STATUS,
  SIDE,
  type LiveClock,
  type LiveEventVM,
  type LiveMatchSnapshot,
  type LiveOfficialVM,
} from '../live-match/live-match'
import { readLivePlayers } from './read-live-players'

const homeTeam = alias(tables.seasonTeams, 'live_home_team')
const awayTeam = alias(tables.seasonTeams, 'live_away_team')
const homeClub = alias(tables.clubs, 'live_home_club')
const awayClub = alias(tables.clubs, 'live_away_club')

const OFFICIAL_LABEL = {
  arbitro: 'Árbitro',
  assistente_1: 'Assist. 1',
  assistente_2: 'Assist. 2',
  quarto_arbitro: '4º árbitro',
  quinto_arbitro: '5º árbitro',
} as const

const LIVE_EVENT_TYPES = [LIVE_EVENT_TYPE.GOAL, LIVE_EVENT_TYPE.YELLOW_CARD, LIVE_EVENT_TYPE.RED_CARD, LIVE_EVENT_TYPE.SUBSTITUTION]

const selectMatchHeader = async (matchId: string) => {
  const { matches, seasons, competitions } = tables
  const [row] = await db
    .select({
      id: matches.id,
      seasonId: matches.seasonId,
      status: matches.status,
      round: matches.round,
      phase: matches.phase,
      kickoffAt: matches.kickoffAt,
      venue: matches.venue,
      city: matches.city,
      liveClock: matches.liveClock,
      year: seasons.year,
      championshipName: competitions.name,
      category: competitions.category,
      homeTeamId: matches.homeTeamId,
      awayTeamId: matches.awayTeamId,
      home: teamBadgeColumns(homeClub),
      away: teamBadgeColumns(awayClub),
    })
    .from(matches)
    .innerJoin(seasons, eq(seasons.id, matches.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(homeTeam, eq(homeTeam.id, matches.homeTeamId))
    .innerJoin(homeClub, eq(homeClub.id, homeTeam.clubId))
    .innerJoin(awayTeam, eq(awayTeam.id, matches.awayTeamId))
    .innerJoin(awayClub, eq(awayClub.id, awayTeam.clubId))
    .where(and(eq(matches.id, matchId), isNull(matches.removedAt)))
    .limit(1)

  return row ?? null
}

const readOfficials = async (matchId: string): Promise<LiveOfficialVM[]> => {
  const { matchOfficials } = tables
  const rows = await db
    .select({ role: matchOfficials.role, name: matchOfficials.name })
    .from(matchOfficials)
    .where(eq(matchOfficials.matchId, matchId))
    .orderBy(asc(matchOfficials.role))

  return rows.map((row) => ({ label: OFFICIAL_LABEL[row.role], name: toTitleCase(row.name) }))
}

const readActiveEvents = async (matchId: string): Promise<LiveEventVM[]> => {
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
    })
    .from(matchEvents)
    .where(and(eq(matchEvents.matchId, matchId), isNull(matchEvents.deletedAt), isNull(matchEvents.supersededAt), inArray(matchEvents.type, LIVE_EVENT_TYPES)))
    .orderBy(asc(matchEvents.period), asc(matchEvents.minute), asc(matchEvents.createdAt))

  return rows.map((row) => ({
    key: row.clientId ?? row.id,
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
    appliedToLineup: row.type === LIVE_EVENT_TYPE.SUBSTITUTION && row.source === DATA_SOURCE.LIVE,
  }))
}

const clockOf = (persisted: unknown, status: string): LiveClock => {
  if (persisted) return parsePersistedClock(persisted)

  return status === MATCH_STATUS.FINISHED ? { ...INITIAL_LIVE_CLOCK, period: MATCH_PERIOD.FULL_TIME } : INITIAL_LIVE_CLOCK
}

export const getLiveMatch = async (matchId: string): Promise<LiveMatchSnapshot | null> => {
  'use cache'
  cacheLife('seconds')
  cacheTag(tags.match(matchId), tags.fmfData())

  const header = await selectMatchHeader(matchId)
  if (!header) return null

  const [officials, players, events] = await Promise.all([readOfficials(matchId), readLivePlayers(matchId, header.seasonId), readActiveEvents(matchId)])
  const home = toTeamBadge(header.home)
  const away = toTeamBadge(header.away)

  return {
    matchId: header.id,
    seasonId: header.seasonId,
    status: header.status,
    round: header.round,
    phase: header.phase,
    kickoffAt: header.kickoffAt ? header.kickoffAt.toISOString() : null,
    venue: header.venue,
    city: header.city,
    halfLengthMinutes: HALF_LENGTH_MINUTES,
    clock: clockOf(header.liveClock, header.status),
    championship: { name: header.championshipName, category: header.category, year: header.year },
    officials,
    teams: {
      [SIDE.HOME]: { side: SIDE.HOME, seasonTeamId: header.homeTeamId, ...home },
      [SIDE.AWAY]: { side: SIDE.AWAY, seasonTeamId: header.awayTeamId, ...away },
    },
    players,
    events,
  }
}
