import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as relations from './relations'
import * as schema from './schema'

export const databaseSchema = { ...schema, ...relations }

const LOCAL_HOSTS = ['localhost', '127.0.0.1']

const isLocalDatabase = (databaseUrl: string): boolean => LOCAL_HOSTS.includes(new URL(databaseUrl).hostname)

export const createPool = (databaseUrl: string): Pool =>
  new Pool({
    connectionString: databaseUrl,
    ssl: isLocalDatabase(databaseUrl) ? false : { rejectUnauthorized: true },
    max: isLocalDatabase(databaseUrl) ? 1 : 10,
    idleTimeoutMillis: 5_000,
  })

export const createDatabase = (pool: Pool) => drizzle({ client: pool, schema: databaseSchema })

export type Database = ReturnType<typeof createDatabase>
