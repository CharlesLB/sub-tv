import { expect, test } from '@playwright/test'
import { countActiveEventsOf } from '../support/database/database'
import {
  type CreatedLiveMatch,
  createLiveMatch,
  NO_SEASON_READY,
  openActionMenu,
  openLiveMatch,
  pitchDots,
  removeLiveMatch,
  STREAM_TIMEOUT,
  scoreboard,
  startFirstHalf,
} from '../support/live-match/live-match'

const GOAL_EVENT = 'gol'
const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('live goal from the player menu raises the score, lists the event and is saved on the server', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await expect(scoreboard(page, 0, 0)).toBeVisible()
  await startFirstHalf(page)

  const menu = await openActionMenu(page, pitchDots(page).first())
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()

  await expect(scoreboard(page, 1, 0)).toBeVisible()
  await expect(page.getByText(/^GOL — #\d+/)).toBeVisible()
  await expect(page.getByText('1 Evento', { exact: false })).toBeVisible()
  await expect(pitchDots(page).first().locator('[title="1 gol"]')).toBeVisible()
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
  expect(await countActiveEventsOf(created.match?.matchId ?? '', GOAL_EVENT)).toBe(1)
})

test('undo on the goal toast brings the score back and removes the event on the server', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const menu = await openActionMenu(page, pitchDots(page).first())
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()
  await expect(scoreboard(page, 2, 0)).toBeVisible()

  await page.getByRole('button', { name: 'Desfazer' }).click()

  await expect(scoreboard(page, 1, 0)).toBeVisible()
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
  await expect.poll(() => countActiveEventsOf(created.match?.matchId ?? '', GOAL_EVENT)).toBe(1)
})

test('reloading the live page keeps the goals already saved', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await page.reload()

  await expect(scoreboard(page, 1, 0)).toBeVisible(STREAM_TIMEOUT)
  await expect(page.getByText(/^GOL — #\d+/)).toBeVisible()
})
