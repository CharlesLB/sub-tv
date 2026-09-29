import { expect, type Page, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

const openFinishedChampionship = async (page: Page): Promise<string> => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)

  return new URL(page.url()).pathname
}

const tabs = (page: Page) => page.getByRole('navigation', { name: 'Seções do campeonato' })

test('championship opens on the standings tab by default', async ({ page }) => {
  await openFinishedChampionship(page)

  await expect(tabs(page).getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByText('Classificação', { exact: true }).first()).toBeVisible(SLOW_PAGE)
})

test('championship tabs switch between standings, statistics and matches and write the tab to the URL', async ({ page }) => {
  await openFinishedChampionship(page)

  await tabs(page).getByRole('link', { name: 'Estatísticas' }).click()
  await expect(page).toHaveURL(/aba=estatisticas/)
  await expect(page.getByText('Artilharia', { exact: true })).toBeVisible(SLOW_PAGE)
  await expect(page.getByText('Gols contam apenas nesta categoria.')).toBeVisible()

  await tabs(page).getByRole('link', { name: 'Partidas' }).click()
  await expect(page).toHaveURL(/aba=partidas/)
  await expect(tabs(page).getByRole('link', { name: 'Partidas' })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('article').first()).toBeVisible(SLOW_PAGE)

  await tabs(page).getByRole('link', { name: 'Classificação e rodada' }).click()
  await expect(tabs(page).getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page')
})

test('championship with an unknown tab in the URL falls back to the standings tab', async ({ page }) => {
  const path = await openFinishedChampionship(page)

  await page.goto(`${path}?aba=inexistente`)

  await expect(tabs(page).getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page', SLOW_PAGE)
})

test('championship page title combines name, category and year', async ({ page }) => {
  await openFinishedChampionship(page)

  await expect(page).toHaveTitle(/ SUB-1[34] 2024 · sub\.tv$/, SLOW_PAGE)
})
