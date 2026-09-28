import { expect, test, type Locator, type Page } from '@playwright/test'
import { deleteMatchAndRestoreBroadcasts, findSeasonReadyForNewMatch, readBroadcastMatchIds, readLineup } from './new-match-database'
import { signIn } from './sign-in'

const LIVE_URL_PATTERN = /\/ao-vivo\/([0-9a-f-]{36})$/
const STARTER_DOT_NAME = /^Camisa \d+ — .*Enter manda ao banco$/
const DRAG_STEPS = 12
const DRAG_OFFSET_PX = { x: 70, y: 40 }
const COORDINATE_PRECISION = 0

const cleanup: { matchId: string | null; previousBroadcastIds: string[] } = { matchId: null, previousBroadcastIds: [] }

const leftPercentOf = async (dot: Locator): Promise<{ x: number; y: number }> => {
  const style = await dot.locator('..').getAttribute('style')
  const [, x = 'NaN', y = 'NaN'] = /left:\s*([\d.]+)%;\s*top:\s*([\d.]+)%/.exec(style ?? '') ?? []

  return { x: Number(x), y: Number(y) }
}

const dragBy = async (page: Page, target: Locator, offset: { x: number; y: number }): Promise<void> => {
  const box = await target.boundingBox()
  if (!box) throw new Error('O alvo do arraste não está visível.')
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + offset.x, start.y + offset.y, { steps: DRAG_STEPS })
  await page.mouse.up()
}

test.afterEach(async () => {
  if (cleanup.matchId) await deleteMatchAndRestoreBroadcasts(cleanup.matchId, cleanup.previousBroadcastIds)
  cleanup.matchId = null
})

test('new match sheet walks the four steps, edits the lineup on the pitch and goes live', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'O campo com arraste só existe no desktop.')
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, 'Nenhum campeonato com dois elencos completos no banco.')
  cleanup.previousBroadcastIds = await readBroadcastMatchIds()

  await signIn(page, `/campeonatos/${seasonId}`)
  await page.getByRole('link', { name: 'Nova partida' }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Nova partida' })
  await expect(sheet).toBeVisible()
  await expect(page).toHaveURL(/\/nova-partida$/)

  await sheet.getByLabel('Local').fill('Arena de teste · campo 1')
  await sheet.getByRole('button', { name: 'Continuar' }).click()
  await expect(sheet.getByText('Time mandante')).toBeVisible()
  await sheet.getByRole('button', { name: 'Continuar' }).click()

  await sheet.getByRole('button', { name: 'Lista' }).click()
  await expect(sheet.getByRole('checkbox').first()).toBeVisible()
  await sheet.getByRole('button', { name: 'Campo' }).click()
  const dots = sheet.getByRole('button', { name: STARTER_DOT_NAME })
  await expect(dots).toHaveCount(22)

  const movedDot = dots.nth(3)
  const movedName = ((await movedDot.getAttribute('aria-label')) ?? '').replace(/^Camisa \d+ — /, '').replace(/, [^,]+\. Enter manda ao banco$/, '')
  const before = await leftPercentOf(movedDot)
  await dragBy(page, movedDot, DRAG_OFFSET_PX)
  const movedDotAfter = sheet.getByRole('button', { name: new RegExp(`— ${movedName},`) })
  const after = await leftPercentOf(movedDotAfter)
  expect(after.x).toBeGreaterThan(before.x)

  await dots.nth(0).click()
  await expect(sheet.getByText('10/11 em campo')).toBeVisible()
  await expect(sheet.getByText('Etapa 3 de 4 — monte os 11 de cada time no campo (10/11 E 11/11)')).toBeVisible()
  await sheet.getByRole('button', { name: /^Reserva camisa/ }).first().click()
  await expect(sheet.getByText('10/11 em campo')).toHaveCount(0)

  await sheet.getByRole('button', { name: 'Continuar' }).click()
  await expect(sheet.getByText('Pronta para transmitir')).toBeVisible()
  await sheet.getByRole('button', { name: 'Criar e ir ao vivo' }).click()
  await page.waitForURL(LIVE_URL_PATTERN, { timeout: 30_000 })
  const matchId = LIVE_URL_PATTERN.exec(new URL(page.url()).pathname)?.[1] ?? null
  cleanup.matchId = matchId
  expect(matchId).not.toBeNull()

  const lineup = await readLineup(matchId ?? '')
  const starters = lineup.filter((row) => row.isStarter)
  const movedRow = starters.find((row) => row.fullName === movedName)
  expect(starters).toHaveLength(22)
  expect(starters.every((row) => row.pitchX !== null && row.pitchY !== null)).toBe(true)
  expect(lineup.filter((row) => !row.isStarter).every((row) => row.pitchX === null)).toBe(true)
  expect(movedRow?.pitchX).toBeCloseTo(after.x, COORDINATE_PRECISION)
  expect(movedRow?.pitchY).toBeCloseTo(after.y, COORDINATE_PRECISION)
})

test('new match page opened by URL renders the wizard with the championship context', async ({ page }) => {
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, 'Nenhum campeonato com dois elencos completos no banco.')

  await signIn(page, `/campeonatos/${seasonId}/nova-partida`)

  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' }).getByText('Nova partida')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Etapas da nova partida' })).toBeVisible()
  await expect(page.getByLabel('Local')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible()
})
