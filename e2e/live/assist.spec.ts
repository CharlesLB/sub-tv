import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openActionMenu, openLiveMatch, pitchDots, removeLiveMatch, STREAM_TIMEOUT, startFirstHalf } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('assist before any goal warns that the goal must be recorded first', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await startFirstHalf(page)

  const menu = await openActionMenu(page, pitchDots(page).nth(1))
  await menu.getByRole('menuitem', { name: /^Assistência/ }).click()

  await expect(page.getByRole('alert').filter({ hasText: /Marque o gol antes da assistência/i })).toBeVisible()
})

test('assist after a teammate goal is attached to the goal in the events strip', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const scorerMenu = await openActionMenu(page, pitchDots(page).first())
  await scorerMenu.getByRole('menuitem', { name: /^Gol/ }).click()
  await expect(page.getByText(/^GOL — #\d+/)).toBeVisible()

  const assistantMenu = await openActionMenu(page, pitchDots(page).nth(1))
  await assistantMenu.getByRole('menuitem', { name: /^Assistência/ }).click()

  await expect(page.getByText(/^GOL — #\d+ .* · ASSIST\. #\d+/)).toBeVisible()
  await expect(pitchDots(page).nth(1).locator('[title="1 assistência"]')).toBeVisible()
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
})

test('the goal scorer cannot also get the assist for the same goal', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const scorerMenu = await openActionMenu(page, pitchDots(page).first())
  await scorerMenu.getByRole('menuitem', { name: /^Gol/ }).click()

  const sameScorerMenu = await openActionMenu(page, pitchDots(page).first())
  await sameScorerMenu.getByRole('menuitem', { name: /^Assistência/ }).click()

  await expect(page.getByRole('alert').filter({ hasText: /Autor do gol não leva a assistência/i })).toBeVisible()
})
