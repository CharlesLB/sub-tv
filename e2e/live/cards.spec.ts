import { expect, test } from '@playwright/test'
import { countActiveEventsOf } from '../support/database/database'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openActionMenu, openLiveMatch, pitchDots, removeLiveMatch, startFirstHalf } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }
const YELLOW_EVENT = 'amarelo'
const RED_EVENT = 'vermelho'

const savedEventsOf = (eventType: string) => countActiveEventsOf(created.match?.matchId ?? '', eventType)

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('yellow card from the player menu is listed and marks the player', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await startFirstHalf(page)

  const menu = await openActionMenu(page, pitchDots(page).nth(2))
  await menu.getByRole('menuitem', { name: /^Cartão amarelo/ }).click()

  await expect(page.getByText(/^AMARELO — #\d+/)).toBeVisible()
  await expect(pitchDots(page).nth(2).locator('[title="Cartão amarelo"]')).toBeVisible()
  await expect.poll(() => savedEventsOf(YELLOW_EVENT)).toBe(1)
})

test('second yellow card for the same player turns into a sending off', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  const menu = await openActionMenu(page, pitchDots(page).nth(2))
  await menu.getByRole('menuitem', { name: /^Cartão amarelo/ }).click()

  await expect(page.getByRole('alert').filter({ hasText: /EXPULSO POR 2º AMARELO/i })).toBeVisible()
  await expect(page.getByText(/^VERMELHO \(2º AMARELO\) — #\d+/)).toBeVisible()
  await expect(pitchDots(page).nth(2).locator('[title="Expulso por 2º amarelo"]')).toBeVisible()
  await expect.poll(() => savedEventsOf(RED_EVENT)).toBe(1)
})

test('a player already sent off cannot score', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  const menu = await openActionMenu(page, pitchDots(page).nth(2))
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()

  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: /Jogador expulso/i })
      .first(),
  ).toBeVisible()
})

test('red card chosen in the card picker opened by the C shortcut sends the player off', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('button[aria-label^="Camisa "][aria-pressed="true"]')).toHaveCount(1)

  await page.keyboard.press('c')
  const picker = page.getByRole('dialog', { name: 'Escolher cartão' })
  await expect(picker).toBeVisible()
  await picker.getByRole('button', { name: 'Vermelho' }).click()

  await expect(picker).toHaveCount(0)
  await expect(page.getByText(/^VERMELHO — #\d+/)).toBeVisible()
  await expect.poll(() => savedEventsOf(RED_EVENT)).toBe(2)
})

test('card picker closes with its cancel button without recording anything', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const eventsBefore = await page.getByText(/^(AMARELO|VERMELHO)/).count()
  await page.keyboard.press('ArrowLeft')

  await page.keyboard.press('c')
  await page.getByRole('dialog', { name: 'Escolher cartão' }).getByRole('button', { name: 'Cancelar (esc)' }).click()

  await expect(page.getByRole('dialog', { name: 'Escolher cartão' })).toHaveCount(0)
  await expect(page.getByText(/^(AMARELO|VERMELHO)/)).toHaveCount(eventsBefore)
})
