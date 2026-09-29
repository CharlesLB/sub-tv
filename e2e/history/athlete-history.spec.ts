import { expect, type Page, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

const openTopScorer = async (page: Page) => {
  await page.goto('/historico')
  await page.getByTitle('Abrir a ficha do atleta').first().click()
  await expect(page).toHaveURL(/\/historico\/atletas\//, SLOW_PAGE)
}

test('athlete history shows goals, games, the best season and the goals chart', async ({ page }) => {
  await openTopScorer(page)

  await expect(page).toHaveTitle('Histórico do atleta · sub.tv')
  await expect(page.getByText('Gols por jogo').first()).toBeVisible(SLOW_PAGE)
  await expect(page.getByText(/\d+ Gols? em \d{4}/i)).toBeVisible()
  await expect(page.getByRole('figure', { name: 'Gols por temporada' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Temporada por temporada' })).toBeVisible()
})

test('athlete history back link returns to the overview', async ({ page }) => {
  await openTopScorer(page)

  await page.getByRole('link', { name: 'Voltar ao geral' }).click()

  await expect(page).toHaveURL(/\/historico$/, SLOW_PAGE)
})

test('athlete history category chip goes to the overview filtered by that category', async ({ page }) => {
  await openTopScorer(page)

  await page.getByRole('link', { name: 'SUB-13', exact: true }).click()

  await expect(page).toHaveURL(/\/historico\?cat=sub13/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)
})
