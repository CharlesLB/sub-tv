import { type Browser, expect, type Locator, type Page } from '@playwright/test'
import { deleteMatchAndRestoreBroadcasts, findSeasonReadyForNewMatch, readBroadcastMatchIds } from '../database/database'
import { signIn } from '../sign-in/sign-in'

const LIVE_URL_PATTERN = /\/ao-vivo\/([0-9a-f-]{36})/
const LIVE_VENUE = 'Campo E2E ao vivo'
const HALF_PITCH_PERCENT = 50
const DRAG_STEPS = 12

export const STREAM_TIMEOUT = { timeout: 15_000 }
export const NO_SEASON_READY = 'Nenhum campeonato com dois elencos completos no banco.'

export type CreatedLiveMatch = { matchId: string; previousBroadcastIds: string[] }

export const createLiveMatch = async (browser: Browser): Promise<CreatedLiveMatch | null> => {
  const seasonId = await findSeasonReadyForNewMatch()
  if (!seasonId) return null
  const previousBroadcastIds = await readBroadcastMatchIds()
  const context = await browser.newContext()
  const page = await context.newPage()
  await signIn(page, `/campeonatos/${seasonId}/nova-partida`)
  await page.getByLabel('Local').fill(LIVE_VENUE)
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Criar e ir ao vivo' }).click()
  await page.waitForURL(LIVE_URL_PATTERN, { timeout: 30_000 })
  const matchId = LIVE_URL_PATTERN.exec(page.url())?.[1] ?? ''
  await context.close()

  return { matchId, previousBroadcastIds }
}

export const removeLiveMatch = async (created: CreatedLiveMatch | null): Promise<void> => {
  if (created) await deleteMatchAndRestoreBroadcasts(created.matchId, created.previousBroadcastIds)
}

export const openLiveMatch = async (page: Page, matchId: string): Promise<void> => {
  await signIn(page, `/ao-vivo/${matchId}`)
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
}

export const scoreboard = (page: Page, homeGoals: number, awayGoals: number): Locator => page.getByRole('group', { name: ` ${homeGoals} × ${awayGoals} ` })

export const pitchDots = (page: Page): Locator => page.locator('button[aria-label^="Camisa "]')

export const homeBench = (page: Page): Locator => page.locator('[data-screen-label="Banco"]').first()

export const benchPlayers = (bench: Locator): Locator => bench.locator('button[aria-label^="Reserva camisa "]')

export const findHomePitchDot = async (page: Page): Promise<Locator> => {
  const leftPercents = await pitchDots(page).evaluateAll((dots) => dots.map((dot) => Number.parseFloat(dot.parentElement?.style.left ?? '')))
  const homeIndex = leftPercents.findIndex((left) => left < HALF_PITCH_PERCENT)

  return pitchDots(page).nth(homeIndex)
}

export const startFirstHalf = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Clique para iniciar a partida' }).click()
  await expect(page.getByRole('button', { name: 'Clique para ir ao intervalo' })).toBeVisible()
}

export const openActionMenu = async (page: Page, dot: Locator): Promise<Locator> => {
  await dot.click()
  const menu = page.getByRole('menu', { name: /^Ações para camisa \d+$/ })
  await expect(menu).toBeVisible()

  return menu
}

export const dragOnto = async (page: Page, source: Locator, target: Locator): Promise<void> => {
  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()
  if (!sourceBox || !targetBox) throw new Error('Origem ou destino do arraste não está visível.')
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: DRAG_STEPS })
  await page.mouse.up()
}
