import { expect, test } from '@playwright/test'
import { countActiveEventsOf } from '../support/database/database'
import {
  benchPlayers,
  type CreatedLiveMatch,
  createLiveMatch,
  dragOnto,
  findHomePitchDot,
  homeBench,
  NO_SEASON_READY,
  openLiveMatch,
  removeLiveMatch,
  STREAM_TIMEOUT,
  startFirstHalf,
} from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }
const SUBSTITUTION_EVENT = 'substituicao'

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('dragging a bench player onto a teammate on the pitch substitutes them', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  await startFirstHalf(page)
  const reserve = benchPlayers(homeBench(page)).first()
  const reserveLabel = (await reserve.getAttribute('aria-label')) ?? ''
  const reserveNumber = /^Reserva camisa (\d+)/.exec(reserveLabel)?.[1] ?? ''
  const starter = await findHomePitchDot(page)
  const starterLabel = (await starter.getAttribute('aria-label')) ?? ''
  const starterNumber = /^Camisa (\d+)/.exec(starterLabel)?.[1] ?? ''

  await dragOnto(page, reserve, starter)

  await expect(page.getByText(`SUBSTITUIÇÃO — SAI #${starterNumber} · ENTRA #${reserveNumber} `).first()).toBeVisible()
  await expect(page.getByRole('button', { name: reserveLabel.replace(/^Reserva camisa/, 'Camisa'), exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: `Reserva ${starterLabel.replace(/^Camisa/, 'camisa')} (substituído)`, exact: true })).toBeVisible()
  await expect.poll(() => countActiveEventsOf(created.match?.matchId ?? '', SUBSTITUTION_EVENT), STREAM_TIMEOUT).toBe(1)
})

test('the substitution survives a reload of the live page', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await expect(page.getByText(/^SUBSTITUIÇÃO — SAI #\d+ · ENTRA #\d+/)).toBeVisible()
  await expect(page.locator('button[aria-label$="(substituído)"]')).toHaveCount(1)
})

test('a player already substituted cannot come back from the bench', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const substituted = page.locator('button[aria-label$="(substituído)"]')

  await expect(substituted).toHaveAttribute('aria-disabled', 'true')
})
