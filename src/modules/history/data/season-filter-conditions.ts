import 'server-only'
import { type AnyColumn, eq, inArray, type SQL, sql } from 'drizzle-orm'
import { tables } from '@/lib/db'
import type { HistoryFilter } from '../lib/history-filter/history-filter'

export const FINISHED_MATCH_STATUS = 'encerrado'

export const seasonFilterConditions = (filter: HistoryFilter): SQL[] => [
  ...(filter.category ? [eq(tables.competitions.category, filter.category)] : []),
  ...(filter.years.length > 0 ? [inArray(tables.seasons.year, filter.years)] : []),
]

export const sumAsNumber = (column: AnyColumn | SQL): SQL<number> => sql<number>`coalesce(sum(${column}), 0)`.mapWith(Number)

export const distinctTextList = (column: AnyColumn): SQL<string[]> => sql<string[]>`array_agg(distinct ${column}::text)`
