import { describe, expect, it } from 'vitest'
import { createSessionToken, readSessionToken } from './session-token'

const SECRET = 'a'.repeat(64)
const USER_ID = '6f1c1a4e-2b7d-4c1e-9a55-0d3b8e2f7c10'
const NOW = 1_800_000_000

describe('session-token', () => {
  it('readSessionToken with a freshly created token returns the user id', async () => {
    const token = await createSessionToken(USER_ID, SECRET, NOW)

    await expect(readSessionToken(token, SECRET, NOW + 60)).resolves.toMatchObject({ userId: USER_ID })
  })

  it('readSessionToken with a tampered user id returns null', async () => {
    const token = await createSessionToken(USER_ID, SECRET, NOW)
    const tampered = token.replace(USER_ID, '11111111-2b7d-4c1e-9a55-0d3b8e2f7c10')

    await expect(readSessionToken(tampered, SECRET, NOW)).resolves.toBeNull()
  })

  it('readSessionToken after expiry returns null', async () => {
    const token = await createSessionToken(USER_ID, SECRET, NOW)

    await expect(readSessionToken(token, SECRET, NOW + 60 * 60 * 24 * 15)).resolves.toBeNull()
  })
})
