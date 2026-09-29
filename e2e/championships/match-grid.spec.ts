import { expect, test } from '@playwright/test'
import { findScheduledMatchReadyForBroadcast } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'

const SLOW_PAGE = { timeout: 20_000 }

test('matches tab groups the matches by round and each card shows its status', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)

  await page.getByRole('navigation', { name: 'Seções do campeonato' }).getByRole('link', { name: 'Partidas' }).click()

  await expect(page.getByText(/Rodada \d+/i).first()).toBeVisible(SLOW_PAGE)
  await expect(page.locator('article', { hasText: 'ENCERRADA' }).first()).toContainText(/FINAL|PÊNALTIS \d+–\d+/)
})

test('finished match card opens the match on the broadcast page as finished', async ({ page }) => {
  await signIn(page, '/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)
  await page.getByRole('navigation', { name: 'Seções do campeonato' }).getByRole('link', { name: 'Partidas' }).click()

  await page.locator('article', { hasText: 'ENCERRADA' }).first().getByRole('link', { name: 'Ver partida' }).click()

  await expect(page).toHaveURL(/\/ao-vivo\/[0-9a-f-]{36}$/, SLOW_PAGE)
  await expect(page.getByText(/^Encerrada · /)).toBeVisible(SLOW_PAGE)
})

test('scheduled match card offers to narrate it through the new match flow', async ({ page }) => {
  const scheduled = await findScheduledMatchReadyForBroadcast()
  test.skip(scheduled === null, 'Nenhuma partida agendada com elencos completos no banco.')

  await page.goto(`/campeonatos/${scheduled?.seasonId}?aba=partidas`)

  await expect(page.locator(`a[href="/campeonatos/${scheduled?.seasonId}/nova-partida?partida=${scheduled?.matchId}"]`).first()).toBeVisible(SLOW_PAGE)
})
