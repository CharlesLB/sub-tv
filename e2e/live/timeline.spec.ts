import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openActionMenu, openLiveMatch, pitchDots, removeLiveMatch, startFirstHalf } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('empty match shows the events placeholder and the expanded timeline explains it is empty', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await expect(page.getByText('gols, cartões e substituições aparecerão aqui')).toBeVisible()
  const toggle = page.getByRole('button', { name: /^(Expandir|Recolher) a linha do tempo$/ })

  await toggle.click()

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('Nada registrado ainda')).toBeVisible()
  await expect(pitchDots(page)).toHaveCount(0)
})

test('expanded timeline lists the recorded goal and collapsing it brings the pitch back', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await startFirstHalf(page)
  const menu = await openActionMenu(page, pitchDots(page).first())
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()
  const toggle = page.getByRole('button', { name: /^(Expandir|Recolher) a linha do tempo$/ })

  await toggle.click()
  await expect(page.getByText('Timeline', { exact: true })).toBeVisible()
  await expect(page.getByText(/GOL/).first()).toBeVisible()

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(pitchDots(page).first()).toBeVisible()
})
