import { expect, test } from '@playwright/test'
import { countActiveEventsOf } from '../support/database/database'
import {
  benchPlayers,
  type CreatedLiveMatch,
  createLiveMatch,
  findHomePitchDot,
  homeBench,
  NO_SEASON_READY,
  openActionMenu,
  openLiveMatch,
  pitchDots,
  removeLiveMatch,
  startFirstHalf,
} from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }
const selectedDot = 'button[aria-label^="Camisa "][aria-pressed="true"]'

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('arrow keys select a player on the pitch and the G shortcut records the goal', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await startFirstHalf(page)

  await page.keyboard.press('ArrowRight')
  await expect(page.locator(selectedDot)).toHaveCount(1)
  const selectedNumber = /^Camisa (\d+)/.exec((await page.locator(selectedDot).getAttribute('aria-label')) ?? '')?.[1] ?? ''
  await page.keyboard.press('g')

  await expect(page.getByRole('group', { name: / (1 × 0|0 × 1) / })).toBeVisible()
  await expect(page.getByText(`GOL — #${selectedNumber} `).first()).toBeVisible()
  await expect.poll(() => countActiveEventsOf(created.match?.matchId ?? '', 'gol')).toBe(1)
})

test('escape closes the player action menu', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const menu = await openActionMenu(page, pitchDots(page).first())
  await expect(menu.getByRole('menuitem').first()).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(menu).toHaveCount(0)
})

test('hovering a player on the pitch shows the tooltip with the season numbers', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await pitchDots(page).first().hover()

  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toBeVisible()
  await expect(tooltip).toContainText('Gols')
  await expect(tooltip).toContainText('Jogos')
})

test('S shortcut on a selected player highlights the bench and clicking a teammate substitutes them', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const starter = await findHomePitchDot(page)
  await openActionMenu(page, starter)
  await page.keyboard.press('Escape')
  await expect(starter).toHaveAttribute('aria-pressed', 'true')

  await page.keyboard.press('s')
  await benchPlayers(homeBench(page)).first().click()

  await expect(page.getByText(/^SUBSTITUIÇÃO — SAI #\d+ · ENTRA #\d+/)).toBeVisible()
  await expect.poll(() => countActiveEventsOf(created.match?.matchId ?? '', 'substituicao')).toBe(1)
})
