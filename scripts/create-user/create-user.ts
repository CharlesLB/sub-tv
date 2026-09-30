import bcrypt from 'bcryptjs'
import { createDatabase, createPool } from '../../src/lib/db/connection'
import { appUsers } from '../../src/lib/db/schema'
import { normalizeUsername } from '../../src/modules/auth/lib/normalize-username/normalize-username'

const BCRYPT_COST = 12
const USAGE = 'uso: pnpm users:create "<nome do usuário>" "<senha>"'

const [username, password] = process.argv.slice(2)
const databaseUrl = process.env.DATABASE_URL
if (!username?.trim() || !password) throw new Error(USAGE)
if (!databaseUrl) throw new Error('DATABASE_URL is required to create a user')

const pool = createPool(databaseUrl)
const database = createDatabase(pool)
const passwordHash = await bcrypt.hash(password, BCRYPT_COST)
const displayName = username.trim().replace(/\s+/g, ' ')

await database
  .insert(appUsers)
  .values({ username: displayName, normalizedUsername: normalizeUsername(displayName), passwordHash })
  .onConflictDoUpdate({ target: appUsers.normalizedUsername, set: { username: displayName, passwordHash, isActive: true } })

await pool.end()
console.info(`usuário "${displayName}" pronto`)
