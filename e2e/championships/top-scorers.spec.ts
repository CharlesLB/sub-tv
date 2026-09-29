import { expect, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

test('statistics tab lists the top scorers with goals and games and explains the tie-break', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)

  await page.getByRole('navigation', { name: 'Seções do campeonato' }).getByRole('link', { name: 'Estatísticas' }).click()

  await expect(page.getByText('Artilharia', { exact: true })).toBeVisible(SLOW_PAGE)
  await expect(page.getByText('Atleta', { exact: true })).toBeVisible()
  await expect(page.getByText('G gols · J jogos · em caso de empate, quem fez os gols em menos jogos aparece na frente.')).toBeVisible()
})
