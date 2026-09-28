import 'server-only'
import { attachDatabasePool } from '@vercel/functions'
import { env } from '@/lib/env'
import { createDatabase, createPool } from './connection'

const pool = createPool(env.DATABASE_URL)
attachDatabasePool(pool)

export const db = createDatabase(pool)
export * as tables from './schema'
