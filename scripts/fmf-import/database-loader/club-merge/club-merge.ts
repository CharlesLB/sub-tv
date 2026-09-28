import { sql } from 'drizzle-orm'
import * as R from 'remeda'
import type { Database } from '../../../../src/lib/db/connection'
import { CREST_ALIASES } from '../../constants/club-aliases'
import type { Transaction } from '../database-context/database-context'

type StaffDuplicate = { duplicateId: string; keeperId: string }

const STAFF_REFERENCES = [
  { table: 'season_staff', column: 'staff_member_id', uniqueScope: ['season_team_id', 'role'] },
  { table: 'match_staff', column: 'staff_member_id', uniqueScope: ['match_id', 'role'] },
  { table: 'staff_season_stats', column: 'staff_member_id', uniqueScope: ['season_team_id'] },
  { table: 'match_events', column: 'staff_member_id', uniqueScope: [] },
  { table: 'curiosities', column: 'staff_member_id', uniqueScope: [] },
] as const

const mergeClubPair = async (transaction: Transaction, aliasCrestId: string, canonicalCrestId: string): Promise<boolean> => {
  const aliasRows = await transaction.execute<{ id: string }>(sql`select id from clubs where fmf_crest_id = ${aliasCrestId}`)
  const canonicalRows = await transaction.execute<{ id: string }>(sql`select id from clubs where fmf_crest_id = ${canonicalCrestId}`)
  const aliasId = aliasRows.rows[0]?.id
  const canonicalId = canonicalRows.rows[0]?.id
  if (!aliasId) return false
  if (!canonicalId) {
    await transaction.execute(sql`update clubs set fmf_crest_id = ${canonicalCrestId}, updated_at = now() where id = ${aliasId}`)

    return true
  }
  await transaction.execute(sql`
    update clubs canonical set
      official_name = coalesce(canonical.official_name, alias.official_name),
      display_name = coalesce(canonical.display_name, alias.display_name),
      abbreviation = coalesce(canonical.abbreviation, alias.abbreviation),
      color = coalesce(canonical.color, alias.color),
      city = coalesce(canonical.city, alias.city),
      updated_at = now()
    from clubs alias
    where canonical.id = ${canonicalId} and alias.id = ${aliasId}
  `)
  await transaction.execute(sql`update season_teams set club_id = ${canonicalId}, updated_at = now() where club_id = ${aliasId}`)
  await transaction.execute(sql`delete from clubs where id = ${aliasId}`)

  return true
}

const readStaffDuplicates = async (transaction: Transaction): Promise<StaffDuplicate[]> => {
  const result = await transaction.execute<{ duplicate_id: string; keeper_id: string }>(sql`
    with club_staff as (
      select distinct member.id, member.normalized_name, member.created_at, team.club_id
      from staff_members member
      join season_staff season_member on season_member.staff_member_id = member.id
      join season_teams team on team.id = season_member.season_team_id
    ),
    keepers as (
      select club_id, normalized_name, (array_agg(id order by created_at, id))[1] as keeper_id
      from club_staff
      group by club_id, normalized_name
      having count(distinct id) > 1
    )
    select distinct on (club_staff.id) club_staff.id as duplicate_id, keepers.keeper_id
    from club_staff
    join keepers using (club_id, normalized_name)
    where club_staff.id <> keepers.keeper_id and club_staff.id not in (select keeper_id from keepers)
    order by club_staff.id, keepers.keeper_id
  `)

  return result.rows.map((row) => ({ duplicateId: row.duplicate_id, keeperId: row.keeper_id }))
}

const repointStaff = async (transaction: Transaction, duplicate: StaffDuplicate): Promise<void> => {
  await R.pipe(
    STAFF_REFERENCES,
    R.map((reference) => async () => {
      const table = sql.raw(reference.table)
      const column = sql.raw(reference.column)
      const conflict =
        reference.uniqueScope.length === 0
          ? sql`false`
          : sql`exists (select 1 from ${table} other where other.${column} = ${duplicate.keeperId} and ${sql.join(
              reference.uniqueScope.map((scopeColumn) => sql`other.${sql.raw(scopeColumn)} = ${table}.${sql.raw(scopeColumn)}`),
              sql` and `,
            )})`
      await transaction.execute(sql`delete from ${table} where ${column} = ${duplicate.duplicateId} and ${conflict}`)
      await transaction.execute(sql`update ${table} set ${column} = ${duplicate.keeperId} where ${column} = ${duplicate.duplicateId}`)
    }),
  ).reduce<Promise<void>>(async (previous, step) => {
    await previous
    await step()
  }, Promise.resolve())
  await transaction.execute(sql`delete from staff_members where id = ${duplicate.duplicateId}`)
}

export const mergeClubAliases = async (database: Database): Promise<number> =>
  await database.transaction(async (transaction) => {
    const merged = await Object.entries(CREST_ALIASES).reduce<Promise<number>>(
      async (previous, [aliasCrestId, canonicalCrestId]) => (await previous) + ((await mergeClubPair(transaction, aliasCrestId, canonicalCrestId)) ? 1 : 0),
      Promise.resolve(0),
    )
    const duplicates = await readStaffDuplicates(transaction)
    await duplicates.reduce<Promise<void>>(async (previous, duplicate) => {
      await previous
      await repointStaff(transaction, duplicate)
    }, Promise.resolve())
    console.info(`clubes unificados por alias de escudo: ${merged}; membros de comissão duplicados unificados: ${duplicates.length}`)

    return merged
  })
