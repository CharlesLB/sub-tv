import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openActionMenu, openLiveMatch, pitchDots, removeLiveMatch, STREAM_TIMEOUT, scoreboard } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('goal recorded on one machine appears on another machine watching the same match', async ({ browser }) => {
  test.skip(!created.match, NO_SEASON_READY)
  const operatorContext = await browser.newContext()
  const narratorContext = await browser.newContext()
  const operator = await operatorContext.newPage()
  const narrator = await narratorContext.newPage()
  await openLiveMatch(operator, created.match?.matchId ?? '')
  await openLiveMatch(narrator, created.match?.matchId ?? '')
  await expect(scoreboard(narrator, 0, 0)).toBeVisible()

  const menu = await openActionMenu(operator, pitchDots(operator).first())
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()

  await expect(scoreboard(operator, 1, 0)).toBeVisible()
  await expect(scoreboard(narrator, 1, 0)).toBeVisible(STREAM_TIMEOUT)
  await expect(narrator.getByText(/^GOL — #\d+/)).toBeVisible()
  await operatorContext.close()
  await narratorContext.close()
})

test('undo on one machine removes the goal on the other machine too', async ({ browser }) => {
  test.skip(!created.match, NO_SEASON_READY)
  const operatorContext = await browser.newContext()
  const narratorContext = await browser.newContext()
  const operator = await operatorContext.newPage()
  const narrator = await narratorContext.newPage()
  await openLiveMatch(operator, created.match?.matchId ?? '')
  await openLiveMatch(narrator, created.match?.matchId ?? '')
  const menu = await openActionMenu(operator, pitchDots(operator).first())
  await menu.getByRole('menuitem', { name: /^Gol/ }).click()
  await expect(scoreboard(narrator, 2, 0)).toBeVisible(STREAM_TIMEOUT)

  await operator.getByRole('button', { name: 'Desfazer' }).click()

  await expect(scoreboard(narrator, 1, 0)).toBeVisible(STREAM_TIMEOUT)
  await operatorContext.close()
  await narratorContext.close()
})
