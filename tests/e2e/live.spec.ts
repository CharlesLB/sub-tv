import { expect, test, type Page } from '@playwright/test'
import { deleteCreatedMatch, findSeasonWithFullSquads } from './live-database'
import { signIn } from './sign-in'

const LIVE_URL = /\/ao-vivo\/([0-9a-f-]{36})/
const E2E_VENUE = 'Campo E2E ao vivo'
const STREAM_TIMEOUT_MS = 12_000

const created = { matchId: '' }

test.describe.configure({ mode: 'serial' })

const scoreboard = (page: Page, home: number, away: number) => page.getByRole('group', { name: new RegExp(` ${home} × ${away} `) })

const openLiveMatch = async (page: Page) => {
  await signIn(page, `/ao-vivo/${created.matchId}`)
  await expect(page.getByText('Sincronizado')).toBeVisible({ timeout: STREAM_TIMEOUT_MS })
}

const recordGoalForFirstPlayer = async (page: Page) => {
  await page.locator('button[aria-label^="Camisa "]').first().click()
  await page.getByRole('menuitem', { name: /^Gol/ }).click()
}

test.beforeAll(async ({ browser }) => {
  const seasonId = await findSeasonWithFullSquads()
  test.skip(!seasonId, 'Nenhum campeonato com dois elencos completos no banco.')
  const page = await browser.newPage()
  await signIn(page, `/campeonatos/${seasonId}/nova-partida`)
  await page.getByLabel('Local').fill(E2E_VENUE)
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Criar e ir ao vivo' }).click()
  await page.waitForURL(LIVE_URL)
  created.matchId = LIVE_URL.exec(page.url())?.[1] ?? ''
  await page.close()
})

test.afterAll(async () => {
  if (created.matchId) await deleteCreatedMatch(created.matchId)
})

test('live screen records a goal from the dot menu and undoes it from the toast', async ({ page }) => {
  await openLiveMatch(page)

  await page.getByRole('button', { name: 'Clique para iniciar a partida' }).click()
  await expect(page.getByText('Ao vivo', { exact: true }).last()).toBeVisible()

  await recordGoalForFirstPlayer(page)
  await expect(scoreboard(page, 1, 0)).toBeVisible()
  await expect(page.getByText(/^GOL — #\d+/)).toBeVisible()

  await page.getByRole('button', { name: 'Desfazer' }).click()
  await expect(scoreboard(page, 0, 0)).toBeVisible()
  await expect(page.getByText('gols, cartões e substituições aparecerão aqui')).toBeVisible()
  await expect(page.getByText('Sincronizado')).toBeVisible({ timeout: STREAM_TIMEOUT_MS })
})

test('goal recorded on one machine appears on another machine watching the same match', async ({ browser }) => {
  const operatorContext = await browser.newContext()
  const narratorContext = await browser.newContext()
  const operator = await operatorContext.newPage()
  const narrator = await narratorContext.newPage()
  await openLiveMatch(operator)
  await openLiveMatch(narrator)
  await expect(scoreboard(narrator, 0, 0)).toBeVisible()

  await recordGoalForFirstPlayer(operator)

  await expect(scoreboard(operator, 1, 0)).toBeVisible()
  await expect(scoreboard(narrator, 1, 0)).toBeVisible({ timeout: STREAM_TIMEOUT_MS })
  await expect(narrator.getByText(/^GOL — #\d+/)).toBeVisible()
  await expect(operator.getByText('Sincronizado')).toBeVisible({ timeout: STREAM_TIMEOUT_MS })
  await operatorContext.close()
  await narratorContext.close()
})
