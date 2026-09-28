import { sql } from 'drizzle-orm'
import type { Database } from '../../../../src/lib/db/connection'
import { normalizeName, redactDocuments, sanitizePersonName } from '../../text-normalization/text-normalization'
import type { Transaction } from '../database-context/database-context'

const REDACTED_TEXT = '[removido]'
const PERSON_NAME_KEY = 'nome'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

const scrubJson = (value: JsonValue, key: string | null): JsonValue => {
  if (typeof value === 'string') return key === PERSON_NAME_KEY ? sanitizePersonName(value) : redactDocuments(value)
  if (Array.isArray(value)) return value.map((item) => scrubJson(item, key))
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([entryKey, entry]) => [entryKey, scrubJson(entry, entryKey)]))

  return value
}

const runSequentially = async <Item>(items: Item[], work: (item: Item) => Promise<unknown>): Promise<void> =>
  await items.reduce<Promise<void>>(async (previous, item) => {
    await previous
    await work(item)
  }, Promise.resolve())

const scrubPlayers = async (transaction: Transaction): Promise<number> => {
  const result = await transaction.execute<{ id: string; full_name: string; nickname: string | null }>(sql`select id, full_name, nickname from players where full_name ~ '[0-9]' or nickname ~ '[0-9]'`)

  await runSequentially(result.rows, async (row) => {
    const nickname = sanitizePersonName(row.nickname ?? '')
    const fullName = sanitizePersonName(row.full_name) || nickname || REDACTED_TEXT

    return await transaction.execute(sql`update players set full_name = ${fullName}, nickname = ${nickname || null}, updated_at = now() where id = ${row.id}`)
  })

  return result.rows.length
}

const scrubStaff = async (transaction: Transaction): Promise<number> => {
  const result = await transaction.execute<{ id: string; full_name: string }>(sql`select id, full_name from staff_members where full_name ~ '[0-9]' or display_name ~ '[0-9]'`)

  await runSequentially(result.rows, async (row) => {
    const fullName = sanitizePersonName(row.full_name) || REDACTED_TEXT

    return await transaction.execute(sql`update staff_members set full_name = ${fullName}, normalized_name = ${normalizeName(fullName)}, display_name = null, updated_at = now() where id = ${row.id}`)
  })

  return result.rows.length
}

const scrubIssueDetails = async (transaction: Transaction): Promise<number> => {
  const result = await transaction.execute<{ id: string; details: JsonValue }>(sql`select id, details from sync_issues where details::text ~ '[0-9]'`)

  const changed = result.rows.flatMap((row) => {
    const scrubbed = scrubJson(row.details, null)

    return JSON.stringify(scrubbed) === JSON.stringify(row.details) ? [] : [{ id: row.id, scrubbed }]
  })

  await runSequentially(changed, async (row) => await transaction.execute(sql`update sync_issues set details = ${JSON.stringify(row.scrubbed)}::jsonb where id = ${row.id}`))

  return changed.length
}

const scrubEventNotes = async (transaction: Transaction): Promise<number> => {
  const result = await transaction.execute<{ id: string; note: string }>(sql`select id, note from match_events where note ~ '[0-9]'`)
  const changed = result.rows.filter((row) => redactDocuments(row.note) !== row.note)
  await runSequentially(changed, async (row) => await transaction.execute(sql`update match_events set note = ${redactDocuments(row.note)} where id = ${row.id}`))

  return changed.length
}

export const scrubPersonalData = async (database: Database): Promise<void> =>
  await database.transaction(async (transaction) => {
    const players = await scrubPlayers(transaction)
    const staff = await scrubStaff(transaction)
    const issues = await scrubIssueDetails(transaction)
    const notes = await scrubEventNotes(transaction)
    console.info(`dados pessoais saneados: ${players} jogadores, ${staff} membros de comissão, ${issues} pendências, ${notes} observações de cartão`)
  })
