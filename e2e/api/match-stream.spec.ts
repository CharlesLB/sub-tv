import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, removeLiveMatch } from '../support/live-match/live-match'
import { signIn } from '../support/sign-in/sign-in'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('signed-in request to the stream of an invalid match id answers 404 with the error contract', async ({ page }) => {
  await signIn(page, '/campeonatos')

  const response = await page.request.get('/api/partidas/nao-e-um-id/stream')

  expect(response.status()).toBe(404)
  expect(await response.json()).toEqual({ error: { code: 'not_found', message: 'Partida não encontrada.' } })
})

test('signed-in page receives the live stream of a match as server-sent events', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await signIn(page, '/campeonatos')

  const contentType = await page.evaluate(async (matchId) => {
    const controller = new AbortController()
    const response = await fetch(`/api/partidas/${matchId}/stream`, { signal: controller.signal })
    const header = `${response.status} ${response.headers.get('content-type')}`
    controller.abort()

    return header
  }, created.match?.matchId ?? '')

  expect(contentType).toBe('200 text/event-stream; charset=utf-8')
})
