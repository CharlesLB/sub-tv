import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createDatabase, createPool } from '@/lib/db/connection'

const MIGRATIONS_FOLDER = './src/lib/db/migrations'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to run migrations')

const pool = createPool(databaseUrl)
await migrate(createDatabase(pool), { migrationsFolder: MIGRATIONS_FOLDER })
await pool.end()
console.info('migrations applied')
