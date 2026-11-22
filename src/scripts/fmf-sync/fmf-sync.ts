import { createDatabase, createPool } from '@/lib/db/connection'
import { runFmfSync } from '@/modules/fmf-sync/services/fmf-sync/fmf-sync'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL é obrigatório para sincronizar')
const pool = createPool(databaseUrl)

try {
  const summary = await runFmfSync(createDatabase(pool))
  console.info(JSON.stringify(summary, null, 2))
} finally {
  await pool.end()
}
