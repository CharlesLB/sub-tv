import { vi } from 'vitest'

const TEST_SECRET_LENGTH = 32

vi.mock('@/lib/db', async () => {
  const [{ createTestDatabase }, tables] = await Promise.all([import('./test-database'), import('@/lib/db/schema')])

  return { db: await createTestDatabase(), tables }
})

vi.mock('@/lib/env', () => ({ env: { NODE_ENV: 'test', DATABASE_URL: 'postgres://pglite.test/memory', SESSION_SECRET: 'x'.repeat(TEST_SECRET_LENGTH) } }))
