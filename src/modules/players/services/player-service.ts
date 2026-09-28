import 'server-only'
import { and, asc, eq, max } from 'drizzle-orm'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { db, tables } from '@/lib/db'
import { categoryLabel } from '@/modules/championships'
import type { AddCuriosityData, CreateManualPlayerData, RemoveCuriosityData, UpdatePlayerProfileData } from '../schemas'

export type PlayerChange = { playerId: string; seasonTeamIds: string[] }

export type ManualPlayerChange = PlayerChange & { seasonId: string }

const { seasons, competitions, seasonTeams, seasonSquads, players, curiosities, clubs } = tables

const PLAYER_NOT_FOUND = 'Jogador não encontrado. Recarregue a página.'
const CURIOSITY_NOT_FOUND = 'Curiosidade já removida.'
const TEAM_NOT_FOUND = 'Este time não tem elenco nesta temporada.'

const findSeasonTeamIdsOfPlayer = async (playerId: string): Promise<string[]> => {
  const rows = await db.select({ seasonTeamId: seasonSquads.seasonTeamId }).from(seasonSquads).where(eq(seasonSquads.playerId, playerId))

  return rows.map((row) => row.seasonTeamId)
}

const toPlayerChange = async (playerId: string): Promise<ActionResult<PlayerChange>> => ok({ playerId, seasonTeamIds: await findSeasonTeamIdsOfPlayer(playerId) })

const findPrimarySeasonTeam = async (input: CreateManualPlayerData) => {
  const [team] = await db
    .select({ id: seasonTeams.id, seasonId: seasonTeams.seasonId, clubName: clubs.displayName, clubShortName: clubs.shortName })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .innerJoin(clubs, eq(clubs.id, seasonTeams.clubId))
    .where(and(eq(seasons.year, input.year), eq(competitions.category, input.category), eq(seasonTeams.clubId, input.clubId)))
    .orderBy(asc(competitions.division), asc(seasons.label))
    .limit(1)

  return team ?? null
}

const isShirtNumberTaken = async (seasonTeamId: string, shirtNumber: number): Promise<boolean> => {
  const [taken] = await db
    .select({ id: seasonSquads.id })
    .from(seasonSquads)
    .where(and(eq(seasonSquads.seasonTeamId, seasonTeamId), eq(seasonSquads.usualShirtNumber, shirtNumber), eq(seasonSquads.isActive, true)))
    .limit(1)

  return taken !== undefined
}

export const playerService = {
  updateProfile: async (input: UpdatePlayerProfileData): Promise<ActionResult<PlayerChange>> => {
    const [updated] = await db
      .update(players)
      .set({ displayName: input.displayName || null, position: input.position ?? null, preferredFoot: input.preferredFoot ?? null })
      .where(eq(players.id, input.playerId))
      .returning({ id: players.id })

    if (!updated) return fail(PLAYER_NOT_FOUND)

    return toPlayerChange(updated.id)
  },

  addCuriosity: async (input: AddCuriosityData, authorId: string): Promise<ActionResult<PlayerChange>> => {
    const [player] = await db.select({ id: players.id }).from(players).where(eq(players.id, input.playerId))
    if (!player) return fail(PLAYER_NOT_FOUND)

    const [ordering] = await db
      .select({ lastSortOrder: max(curiosities.sortOrder) })
      .from(curiosities)
      .where(eq(curiosities.playerId, player.id))

    await db.insert(curiosities).values({ playerId: player.id, text: input.text, sortOrder: (ordering?.lastSortOrder ?? -1) + 1, createdBy: authorId })

    return toPlayerChange(player.id)
  },

  removeCuriosity: async (input: RemoveCuriosityData): Promise<ActionResult<PlayerChange>> => {
    const [removed] = await db.delete(curiosities).where(eq(curiosities.id, input.curiosityId)).returning({ playerId: curiosities.playerId })
    if (!removed?.playerId) return fail(CURIOSITY_NOT_FOUND)

    return toPlayerChange(removed.playerId)
  },

  createManualPlayer: async (input: CreateManualPlayerData): Promise<ActionResult<ManualPlayerChange>> => {
    const team = await findPrimarySeasonTeam(input)
    if (!team) return fail(TEAM_NOT_FOUND)

    if (await isShirtNumberTaken(team.id, input.shirtNumber)) {
      const teamName = team.clubName ?? team.clubShortName

      return fail(`Número ${input.shirtNumber} já está em uso no ${teamName} ${categoryLabel[input.category]}. Escolha outro.`)
    }

    const playerId = await db.transaction(async (transaction) => {
      const [player] = await transaction.insert(players).values({ fullName: input.fullName, cbfId: null }).returning({ id: players.id })
      if (!player) throw new Error('Manual player insert returned no row')
      await transaction.insert(seasonSquads).values({ seasonTeamId: team.id, playerId: player.id, usualShirtNumber: input.shirtNumber })

      return player.id
    })

    return ok({ playerId, seasonTeamIds: [team.id], seasonId: team.seasonId })
  },
}
