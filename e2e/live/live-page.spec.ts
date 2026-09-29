import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openLiveMatch, removeLiveMatch } from '../support/live-match/live-match'
import { signIn } from '../support/sign-in/sign-in'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('live page shows both teams in the title, the championship trail and 22 players on the pitch', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await expect(page).toHaveTitle(/ × .* · Ao vivo · sub\.tv$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/ × /)
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' }).getByRole('link', { name: 'Campeonatos' })).toBeVisible()
  await expect(page.locator('button[aria-label^="Camisa "]')).toHaveCount(22)
  await expect(page.getByText('Campo E2E ao vivo').first()).toBeVisible()
  await expect(page.getByText(/2 × \d+ Min/i).first()).toBeVisible()
})

test('live page for a match that does not exist shows the not-found message', async ({ page }) => {
  await signIn(page, '/ao-vivo/00000000-0000-4000-8000-000000000000')

  await expect(page.getByText('Página não encontrada')).toBeVisible({ timeout: 20_000 })
})
