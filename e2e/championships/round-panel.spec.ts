import { expect, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

test('round panel shows the current round and links to every round on the matches tab', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)
  const roundPanel = page.getByRole('complementary').filter({ hasText: /Rodada/ })

  await expect(roundPanel.getByText(/\d+ Partidas? No campeonato/i)).toBeVisible(SLOW_PAGE)
  await roundPanel.getByRole('link', { name: 'Ver todas as rodadas' }).click()

  await expect(page).toHaveURL(/aba=partidas/, SLOW_PAGE)
})

test('finished match in the round panel opens it on the broadcast page after signing in', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)
  const matchLink = page.getByRole('complementary').getByRole('link', { name: 'Ver partida' }).first()
  await expect(matchLink).toHaveAttribute('href', /^\/ao-vivo\/[0-9a-f-]{36}$/, SLOW_PAGE)

  await matchLink.click()

  await expect(page).toHaveURL(/\/entrar\?para=%2Fao-vivo%2F/)
})
