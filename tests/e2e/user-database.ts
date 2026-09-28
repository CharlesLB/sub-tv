import { Pool } from 'pg'

const LOCAL_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/postgres'

export const deleteUserAndAuditRows = async (normalizedUsername: string): Promise<number> => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? LOCAL_DATABASE_URL, max: 1 })

  try {
    const users = await pool.query<{ id: string }>('select id from app_users where normalized_username = $1', [normalizedUsername])
    const userIds = users.rows.map((row) => row.id)
    await pool.query('delete from audit_log where user_id = any($1::uuid[]) or entity_id = any($1::text[])', [userIds])
    const deleted = await pool.query('delete from app_users where id = any($1::uuid[])', [userIds])

    return deleted.rowCount ?? 0
  } finally {
    await pool.end()
  }
}
