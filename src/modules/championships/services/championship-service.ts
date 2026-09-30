import 'server-only'
import { and, desc, eq, inArray, max, ne, sql } from 'drizzle-orm'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { db, type Transaction, tables } from '@/lib/db'
import { categoryLabel } from '../lib/categories/categories'
import { toChampionshipSlug } from '../lib/championship-slug/championship-slug'
import type { CreateChampionshipData } from '../schemas'

export type CreatedChampionship = { seasonId: string; competitionId: string; slug: string }

const { competitions, seasons, seasonTeams, seasonSquads } = tables

const MANUAL_DIVISION = 'copa'

const hasChampionshipNamed = async (input: CreateChampionshipData): Promise<boolean> => {
  const [existing] = await db
    .select({ id: seasons.id })
    .from(seasons)
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(eq(seasons.year, input.year), eq(competitions.category, input.category), sql`(lower(${competitions.name}) = lower(${input.name}) or lower(${seasons.label}) = lower(${input.name}))`))
    .limit(1)

  return existing !== undefined
}

const findOrCreateCompetition = async (transaction: Transaction, input: CreateChampionshipData, slug: string): Promise<string> => {
  const [existing] = await transaction.select({ id: competitions.id }).from(competitions).where(eq(competitions.slug, slug))
  if (existing) return existing.id
  const [created] = await transaction.insert(competitions).values({ name: input.name, slug, category: input.category, division: MANUAL_DIVISION }).returning({ id: competitions.id })
  if (!created) throw new Error('Competition insert returned no row')

  return created.id
}

const findLatestSeasonTeams = async (transaction: Transaction, input: CreateChampionshipData, newSeasonId: string) => {
  if (input.clubIds.length === 0) return []

  const rows = await transaction
    .select({ id: seasonTeams.id, clubId: seasonTeams.clubId, year: seasons.year })
    .from(seasonTeams)
    .innerJoin(seasons, eq(seasons.id, seasonTeams.seasonId))
    .innerJoin(competitions, eq(competitions.id, seasons.competitionId))
    .where(and(inArray(seasonTeams.clubId, input.clubIds), eq(competitions.category, input.category), ne(seasons.id, newSeasonId)))
    .orderBy(desc(seasons.year), competitions.division)

  return input.clubIds.flatMap((clubId) => {
    const latest = rows.find((row) => row.clubId === clubId)

    return latest ? [latest] : []
  })
}

const copySquads = async (transaction: Transaction, input: CreateChampionshipData, seasonId: string) => {
  if (input.clubIds.length === 0) return

  const createdTeams = await transaction
    .insert(seasonTeams)
    .values(input.clubIds.map((clubId) => ({ seasonId, clubId })))
    .returning({ id: seasonTeams.id, clubId: seasonTeams.clubId })

  const sources = await findLatestSeasonTeams(transaction, input, seasonId)

  const sourceSquads = sources.length
    ? await transaction
        .select({ seasonTeamId: seasonSquads.seasonTeamId, playerId: seasonSquads.playerId, usualShirtNumber: seasonSquads.usualShirtNumber })
        .from(seasonSquads)
        .where(
          and(
            inArray(
              seasonSquads.seasonTeamId,
              sources.map((source) => source.id),
            ),
            eq(seasonSquads.isActive, true),
          ),
        )
    : []

  const copiedMembers = createdTeams.flatMap((team) => {
    const source = sources.find((candidate) => candidate.clubId === team.clubId)

    return sourceSquads.filter((member) => member.seasonTeamId === source?.id).map((member) => ({ seasonTeamId: team.id, playerId: member.playerId, usualShirtNumber: member.usualShirtNumber }))
  })

  if (copiedMembers.length > 0) await transaction.insert(seasonSquads).values(copiedMembers)
}

export const championshipService = {
  create: async (input: CreateChampionshipData): Promise<ActionResult<CreatedChampionship>> => {
    if (await hasChampionshipNamed(input)) {
      return fail(`Já existe “${input.name}” no ${categoryLabel[input.category]} ${input.year}. Escolha outro nome.`)
    }

    const slug = toChampionshipSlug(input.name, input.category)
    const [latest] = await db.select({ year: max(seasons.year) }).from(seasons)
    const isCurrent = input.year >= (latest?.year ?? input.year)

    const created = await db.transaction(async (transaction) => {
      const competitionId = await findOrCreateCompetition(transaction, input, slug)

      const [clash] = await transaction
        .select({ id: seasons.id })
        .from(seasons)
        .where(and(eq(seasons.competitionId, competitionId), eq(seasons.year, input.year)))

      if (clash) return null

      const [season] = await transaction
        .insert(seasons)
        .values({ competitionId, year: input.year, label: input.name, isCurrent, fmfCompetitionId: null, fmfPageUrl: null })
        .returning({ id: seasons.id })

      if (!season) throw new Error('Season insert returned no row')
      await copySquads(transaction, input, season.id)

      return { seasonId: season.id, competitionId, slug }
    })

    if (!created) return fail(`Já existe um campeonato com esse nome no ${categoryLabel[input.category]} ${input.year}.`)

    return ok(created)
  },
}
