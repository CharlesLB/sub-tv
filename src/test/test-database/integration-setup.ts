import { vi } from 'vitest'

vi.mock('@/lib/db', async () => {
  const [{ createTestDatabase }, tables] = await Promise.all([import('./test-database'), import('@/lib/db/schema')])

  return { db: await createTestDatabase(), tables }
})
