import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createDatabase, createPool } from '../src/lib/db/connection'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to run migrations')

const pool = createPool(databaseUrl)
await migrate(createDatabase(pool), { migrationsFolder: './drizzle' })
await pool.end()
console.info('migrations applied')
