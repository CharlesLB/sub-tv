import 'server-only'
import { and, eq, inArray, isNull, ne } from 'drizzle-orm'
import * as R from 'remeda'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { db, tables } from '@/lib/db'
import { readTeamSquads, type SquadMember } from '../data/read-team-squads'
import { toKickoffInstant } from '../kickoff-time/kickoff-time'
import { layoutStarters } from '../pitch-layout/pitch-layout'
import { MATCH_STATUS, SIDE, type Side } from '../live-match/live-match'
import type { CreateBroadcastMatchInput } from '../schemas'

const MANUAL_SOURCE = 'manual'

export type BroadcastMatchCreated = { matchId: string; seasonId: string; previousBroadcastSeasonIds: string[] }

type LineupRow = typeof tables.matchLineups.$inferInsert

type ChosenPosition = { playerId: string; x: number; y: number }

type SideLineup = { side: Side; squad: SquadMember[]; starterIds: string[]; chosenPositions: ChosenPosition[] | undefined }

const toLineupRows = (matchId: string, { side, squad, starterIds, chosenPositions }: SideLineup): LineupRow[] => {
  const starterSet = new Set(starterIds)
  const starters = squad.filter((member) => starterSet.has(member.playerId))

  const layout = layoutStarters(
    starters.map((member) => ({ key: member.playerId, shirtNumber: member.shirtNumber, position: member.position })),
    side === SIDE.HOME,
  )

  const chosen = R.indexBy(
    (chosenPositions ?? []).filter((position) => starterSet.has(position.playerId)),
    (position) => position.playerId,
  )

  const points = { ...layout, ...chosen }

  return squad.map((member) => ({
    matchId,
    side,
    playerId: member.playerId,
    shirtNumber: member.shirtNumber,
    isStarter: starterSet.has(member.playerId),
    pitchX: points[member.playerId]?.x ?? null,
    pitchY: points[member.playerId]?.y ?? null,
    source: MANUAL_SOURCE,
  }))
}

const readTeamsOfSeason = async (seasonId: string, seasonTeamIds: string[]): Promise<Set<string>> => {
  const { seasonTeams } = tables

  const rows = await db
    .select({ id: seasonTeams.id })
    .from(seasonTeams)
    .where(and(eq(seasonTeams.seasonId, seasonId), inArray(seasonTeams.id, seasonTeamIds)))

  return new Set(rows.map((row) => row.id))
}

const isExistingMatchSchedulable = async (seasonId: string, matchId: string): Promise<boolean> => {
  const { matches } = tables

  const [match] = await db
    .select({ id: matches.id })
    .from(matches)
    .where(and(eq(matches.id, matchId), eq(matches.seasonId, seasonId), eq(matches.status, MATCH_STATUS.SCHEDULED), isNull(matches.removedAt)))
    .limit(1)

  return match !== undefined
}

const withoutPlayersOf = (squad: SquadMember[], otherSquad: SquadMember[]): SquadMember[] => {
  const otherIds = new Set(otherSquad.map((member) => member.playerId))

  return squad.filter((member) => !otherIds.has(member.playerId))
}

const belongsToSquad = (squad: SquadMember[], playerIds: string[]): boolean => {
  const squadIds = new Set(squad.map((member) => member.playerId))

  return playerIds.every((playerId) => squadIds.has(playerId))
}

const saveBroadcastMatch = async (input: CreateBroadcastMatchInput, squads: { home: SquadMember[]; away: SquadMember[] }): Promise<BroadcastMatchCreated> =>
  db.transaction(async (transaction) => {
    const { matches, matchLineups, matchTeams } = tables

    const matchFields = {
      round: input.round,
      venue: input.venue,
      kickoffAt: toKickoffInstant(input.kickoffDate, input.kickoffTime),
      homeTeamId: input.homeSeasonTeamId,
      awayTeamId: input.awaySeasonTeamId,
      status: MATCH_STATUS.SCHEDULED,
      isBroadcast: true,
    } as const

    const [savedMatch] = input.existingMatchId
      ? await transaction.update(matches).set(matchFields).where(eq(matches.id, input.existingMatchId)).returning({ id: matches.id })
      : await transaction
          .insert(matches)
          .values({ ...matchFields, seasonId: input.seasonId, phase: null })
          .returning({ id: matches.id })

    if (!savedMatch) throw new Error('A partida não foi gravada.')

    const previousBroadcasts = await transaction
      .update(matches)
      .set({ isBroadcast: false })
      .where(and(eq(matches.isBroadcast, true), ne(matches.id, savedMatch.id)))
      .returning({ seasonId: matches.seasonId })

    await transaction.delete(matchLineups).where(eq(matchLineups.matchId, savedMatch.id))

    await transaction
      .insert(matchLineups)
      .values([
        ...toLineupRows(savedMatch.id, { side: SIDE.HOME, squad: squads.home, starterIds: input.homeStarterIds, chosenPositions: input.homeStarterPositions }),
        ...toLineupRows(savedMatch.id, { side: SIDE.AWAY, squad: squads.away, starterIds: input.awayStarterIds, chosenPositions: input.awayStarterPositions }),
      ])

    await transaction
      .insert(matchTeams)
      .values([SIDE.HOME, SIDE.AWAY].map((side) => ({ matchId: savedMatch.id, side, formation: null })))
      .onConflictDoUpdate({ target: [matchTeams.matchId, matchTeams.side], set: { formation: null } })

    return { matchId: savedMatch.id, seasonId: input.seasonId, previousBroadcastSeasonIds: R.unique(previousBroadcasts.map((match) => match.seasonId)) }
  })

export const matchSetupService = {
  createBroadcastMatch: async (input: CreateBroadcastMatchInput): Promise<ActionResult<BroadcastMatchCreated>> => {
    const teamsOfSeason = await readTeamsOfSeason(input.seasonId, [input.homeSeasonTeamId, input.awaySeasonTeamId])

    if (!teamsOfSeason.has(input.homeSeasonTeamId) || !teamsOfSeason.has(input.awaySeasonTeamId)) {
      return fail('Times fora deste campeonato · Escolha mandante e visitante entre os times inscritos.')
    }

    if (input.existingMatchId && !(await isExistingMatchSchedulable(input.seasonId, input.existingMatchId))) {
      return fail('Partida indisponível · Ela não está mais agendada neste campeonato.')
    }

    const squads = await readTeamSquads([input.homeSeasonTeamId, input.awaySeasonTeamId])
    const home = squads[input.homeSeasonTeamId] ?? []
    const away = withoutPlayersOf(squads[input.awaySeasonTeamId] ?? [], home)

    if (!belongsToSquad(home, input.homeStarterIds) || !belongsToSquad(away, input.awayStarterIds)) {
      return fail('Escalação inválida · Há titulares fora do elenco do time nesta temporada.')
    }

    return ok(await saveBroadcastMatch(input, { home, away }))
  },
}
