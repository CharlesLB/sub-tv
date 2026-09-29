import { expect, test } from '@playwright/test'
import { type CreatedLiveMatch, createLiveMatch, NO_SEASON_READY, openLiveMatch, removeLiveMatch, STREAM_TIMEOUT } from '../support/live-match/live-match'

const created: { match: CreatedLiveMatch | null } = { match: null }

test.describe.configure({ mode: 'serial' })
test.skip(({ isMobile }) => isMobile, 'A prancheta ao vivo é testada no layout de desktop.')

test.beforeAll(async ({ browser }) => {
  created.match = await createLiveMatch(browser)
})

test.afterAll(async () => {
  await removeLiveMatch(created.match)
})

test('added time is refused before the match starts', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await expect(page.getByRole('button', { name: 'Clique para iniciar a partida' })).toBeVisible()
  await expect(page.getByTitle('Adicionar 1 minuto de acréscimo')).toHaveCount(0)
})

test('match clock goes from kick-off through half time and second half to full time', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await page.getByRole('button', { name: 'Clique para iniciar a partida' }).click()
  await expect(page.getByText('1º tempo iniciado')).toBeVisible()
  await expect(page.getByText('Ao vivo', { exact: true }).last()).toBeVisible()

  await page.getByTitle('Adicionar 1 minuto de acréscimo').click()
  await expect(page.getByText(/\+1 Min no 1º tempo/i)).toBeVisible()

  await page.getByRole('button', { name: 'Clique para ir ao intervalo' }).click()
  await expect(page.getByText('Intervalo').first()).toBeVisible()

  await page.getByRole('button', { name: 'Clique para iniciar o 2º tempo' }).click()
  await expect(page.getByText('2º tempo iniciado')).toBeVisible()

  await page.getByRole('button', { name: 'Clique para encerrar a partida' }).click()
  await expect(page.getByText('Fim de jogo').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Jogo encerrado' })).toBeDisabled()
  await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
})

test('the final whistle is kept after reloading the live page', async ({ page }) => {
  test.skip(!created.match, NO_SEASON_READY)
  await openLiveMatch(page, created.match?.matchId ?? '')

  await expect(page.getByRole('button', { name: 'Jogo encerrado' })).toBeDisabled()
})
