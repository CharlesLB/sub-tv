import { expect, test } from '@playwright/test'
import { readMatchStatus } from '../support/database/database'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, removeLiveMatch } from '../support/live-match/live-match'
import { signIn } from '../support/sign-in/sign-in'
import { urlEndingWith } from '../support/url/url'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'O atalho da transmissão fica oculto no celular.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('active broadcast shows a shortcut on other pages that leads back to the live match', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await signIn(page, '/historico')
  const liveHref = `/ao-vivo/${created.match?.matchId}`

  await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Ao vivo' })).toHaveAttribute('href', liveHref)
  await page.locator(`a[title="Voltar à transmissão"][href="${liveHref}"]`).filter({ hasText: ' × ' }).click()

  await expect(page).toHaveURL(urlEndingWith(liveHref))
})

test('closing the broadcast removes the shortcut and the live link from the rail', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await signIn(page, '/historico')

  await page.getByRole('button', { name: 'Fechar transmissão' }).click()

  await expect(page.getByRole('button', { name: 'Fechar transmissão' })).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Ao vivo' })).toHaveCount(0)
  await expect.poll(async () => (await readMatchStatus(created.match?.matchId ?? ''))?.isBroadcast).toBe(false)
})
