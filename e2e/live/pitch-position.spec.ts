import { expect, type Locator, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openLiveMatch, pitchDots, removeLiveMatch, STREAM_TIMEOUT } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }
const DRAG_OFFSET_PX = { x: 60, y: 30 }
const DRAG_STEPS = 12
const COORDINATE_PRECISION = 0

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

const positionOf = async (dot: Locator): Promise<{ x: number; y: number }> => {
  const style = (await dot.locator('..').getAttribute('style')) ?? ''
  const [, x = 'NaN', y = 'NaN'] = /left:\s*([\d.]+)%;\s*top:\s*([\d.]+)%/.exec(style) ?? []

  return { x: Number(x), y: Number(y) }
}

test('dragging a player on the live pitch moves the dot and keeps the new position after a reload', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')
  const dot = pitchDots(page).nth(4)
  const dotName = (await dot.getAttribute('aria-label')) ?? ''
  const before = await positionOf(dot)
  const box = await dot.boundingBox()
  if (!box) throw new Error('A bolinha do jogador não está visível.')

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + DRAG_OFFSET_PX.x, box.y + box.height / 2 + DRAG_OFFSET_PX.y, { steps: DRAG_STEPS })
  await page.mouse.up()

  const movedDot = page.getByRole('button', { name: dotName, exact: true })
  const after = await positionOf(movedDot)
  expect(after.x).toBeGreaterThan(before.x)
  expect(after.y).toBeGreaterThan(before.y)
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)

  await expect
    .poll(async () => {
      await page.reload()
      await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)

      return (await positionOf(page.getByRole('button', { name: dotName, exact: true }))).x
    }, STREAM_TIMEOUT)
    .toBeCloseTo(after.x, COORDINATE_PRECISION)
})
