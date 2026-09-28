import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { databaseSchema } from '@/lib/db/connection'

const MIGRATIONS_FOLDER = './drizzle'

export const createTestDatabase = async () => {
  const database = drizzle({ client: new PGlite(), schema: databaseSchema })
  await migrate(database, { migrationsFolder: MIGRATIONS_FOLDER })

  return database
}
