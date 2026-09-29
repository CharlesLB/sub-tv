import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { DATABASE_URL, E2E_PASSWORD, E2E_USERNAME } from '../credentials/credentials'

const BCRYPT_COST = 10
const USERNAME_LOCALE = 'pt-BR'
const LOCAL_HOSTS = ['localhost', '127.0.0.1']
const REMOTE_DATABASE_FLAG = 'E2E_ALLOW_REMOTE_DATABASE'

const normalizeUsername = (username: string): string => username.trim().replace(/\s+/g, ' ').toLocaleLowerCase(USERNAME_LOCALE)

const assertDatabaseIsDisposable = (): void => {
  const host = new URL(DATABASE_URL).hostname
  if (LOCAL_HOSTS.includes(host) || process.env[REMOTE_DATABASE_FLAG] === '1') return

  throw new Error(`Os testes E2E gravam e apagam dados. Banco remoto (${host}) só com ${REMOTE_DATABASE_FLAG}=1.`)
}

const ensureE2eUser = async (): Promise<void> => {
  const pool = new Pool({ connectionString: DATABASE_URL, max: 1 })

  try {
    const passwordHash = await bcrypt.hash(E2E_PASSWORD, BCRYPT_COST)

    await pool.query(
      `insert into app_users (username, normalized_username, password_hash)
       values ($1, $2, $3)
       on conflict (normalized_username) do update set is_active = true`,
      [E2E_USERNAME, normalizeUsername(E2E_USERNAME), passwordHash],
    )
  } finally {
    await pool.end()
  }
}

const globalSetup = async (): Promise<void> => {
  assertDatabaseIsDisposable()
  await ensureE2eUser()
}

export default globalSetup
