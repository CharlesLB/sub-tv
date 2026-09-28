import { randomUUID } from 'node:crypto'
import { eq, inArray } from 'drizzle-orm'
import * as R from 'remeda'
import { matchStaff, seasonStaff, seasonTeams, staffMembers } from '../../../../src/lib/db/schema'
import { type Side, STAFF_ROLE, type StaffRole } from '../../sumula/sumula-types/sumula-types'
import { normalizeName, sanitizePersonName } from '../../text-normalization/text-normalization'
import type { SeasonTeamLookup } from '../club-loader/club-loader'
import { inChunks, type Transaction } from '../database-context/database-context'
import type { LoadedMatch } from '../match-loader/match-loader'

export type MatchStaffLookup = Map<string, Map<string, string>>

type StaffAppearance = { matchId: string; side: Side; seasonTeamId: string; clubId: string; role: StaffRole; fullName: string; normalizedName: string }

export const staffKey = (side: Side, fullName: string): string => `${side}|${normalizeName(fullName)}`

const clubKey = (clubId: string, normalizedName: string): string => `${clubId}|${normalizedName}`

const collectAppearances = (loadedMatches: LoadedMatch[], clubBySeasonTeam: Map<string, string>): StaffAppearance[] =>
  loadedMatches.flatMap((loaded) => {
    const parsed = loaded.sumula?.parsed
    if (!parsed) return []
    const listed = parsed.staff.map((member) => ({ side: member.side, role: member.role, fullName: member.fullName }))
    const listedKeys = new Set(listed.map((member) => staffKey(member.side, member.fullName)))

    const carded = parsed.cards.flatMap((card) =>
      card.shirtNumber === null && card.side !== null && card.personName.length > 0 && !listedKeys.has(staffKey(card.side, card.personName))
        ? [{ side: card.side, role: STAFF_ROLE.OUTRO, fullName: card.personName }]
        : [],
    )

    return [...listed, ...carded].flatMap((member) => {
      const fullName = sanitizePersonName(member.fullName)
      if (fullName.length === 0) return []
      const seasonTeamId = member.side === 'home' ? loaded.homeSeasonTeamId : loaded.awaySeasonTeamId

      return [{ ...member, fullName, matchId: loaded.matchId, seasonTeamId, clubId: clubBySeasonTeam.get(seasonTeamId) ?? '', normalizedName: normalizeName(fullName) }]
    })
  })

const readExistingStaff = async (transaction: Transaction, clubIds: string[]): Promise<Map<string, string>> => {
  if (clubIds.length === 0) return new Map()

  const rows = await transaction
    .selectDistinct({ id: staffMembers.id, normalizedName: staffMembers.normalizedName, clubId: seasonTeams.clubId })
    .from(staffMembers)
    .innerJoin(seasonStaff, eq(seasonStaff.staffMemberId, staffMembers.id))
    .innerJoin(seasonTeams, eq(seasonTeams.id, seasonStaff.seasonTeamId))
    .where(inArray(seasonTeams.clubId, clubIds))

  return new Map(rows.map((row) => [clubKey(row.clubId, row.normalizedName), row.id]))
}

export const loadStaff = async (transaction: Transaction, loadedMatches: LoadedMatch[], teams: SeasonTeamLookup): Promise<MatchStaffLookup> => {
  const clubBySeasonTeam = new Map([...teams.values()].map((team) => [team.seasonTeamId, team.clubId]))
  const appearances = collectAppearances(loadedMatches, clubBySeasonTeam)
  const existing = await readExistingStaff(transaction, [...new Set(appearances.map((appearance) => appearance.clubId))])

  const newMembers = R.pipe(
    appearances,
    R.filter((appearance) => !existing.has(clubKey(appearance.clubId, appearance.normalizedName))),
    R.uniqueBy((appearance) => clubKey(appearance.clubId, appearance.normalizedName)),
    R.map((appearance) => ({ id: randomUUID(), fullName: appearance.fullName, normalizedName: appearance.normalizedName, clubId: appearance.clubId })),
  )

  await inChunks(newMembers, async (chunk) => transaction.insert(staffMembers).values(chunk.map((member) => ({ id: member.id, fullName: member.fullName, normalizedName: member.normalizedName }))))
  const staffIds = new Map([...existing, ...newMembers.map((member): [string, string] => [clubKey(member.clubId, member.normalizedName), member.id])])
  const staffIdOf = (appearance: StaffAppearance): string => staffIds.get(clubKey(appearance.clubId, appearance.normalizedName)) ?? ''

  const seasonRows = R.uniqueBy(
    appearances.map((appearance) => ({ seasonTeamId: appearance.seasonTeamId, staffMemberId: staffIdOf(appearance), role: appearance.role })),
    (row) => `${row.seasonTeamId}|${row.staffMemberId}|${row.role}`,
  )

  await inChunks(seasonRows, async (chunk) => transaction.insert(seasonStaff).values(chunk).onConflictDoNothing())
  const parsedMatchIds = loadedMatches.filter((loaded) => loaded.sumula?.parsed).map((loaded) => loaded.matchId)
  if (parsedMatchIds.length > 0) await transaction.delete(matchStaff).where(inArray(matchStaff.matchId, parsedMatchIds))
  const matchRows = appearances.map((appearance) => ({ matchId: appearance.matchId, side: appearance.side, staffMemberId: staffIdOf(appearance), role: appearance.role }))
  await inChunks(matchRows, async (chunk) => transaction.insert(matchStaff).values(chunk).onConflictDoNothing())

  return new Map(
    R.pipe(
      appearances,
      R.groupBy((appearance) => appearance.matchId),
      R.entries(),
      R.map(([matchId, group]): [string, Map<string, string>] => [matchId, new Map(group.map((appearance) => [staffKey(appearance.side, appearance.fullName), staffIdOf(appearance)]))]),
    ),
  )
}
