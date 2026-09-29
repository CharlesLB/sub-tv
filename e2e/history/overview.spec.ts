import { expect, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

test('history overview shows the period numbers, highlights, accumulated table and top scorers', async ({ page }) => {
  await page.goto('/historico')

  await expect(page).toHaveTitle('Histórico · sub.tv')
  await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)
  await expect(page.getByText('Gols por jogo').first()).toBeVisible()
  await expect(page.getByText('Melhor aproveitamento')).toBeVisible()
  await expect(page.getByText('Maior artilheiro')).toBeVisible()
  await expect(page.getByText('Mais jogos')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Classificação acumulada por time' }).getByTitle('Abrir a página do time').first()).toContainText('01')
  await expect(page.getByRole('heading', { name: 'Artilheiros do período' })).toBeVisible()
  await expect(page.getByTitle('Abrir a ficha do atleta').first()).toBeVisible()
})

test('history overview opens a team page from the accumulated table and returns with the filters kept', async ({ page }) => {
  await page.goto('/historico?cat=sub14')

  await page.getByTitle('Abrir a página do time').first().click()
  await expect(page).toHaveURL(/\/historico\/times\/sub14-/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Campanha por temporada' })).toBeVisible(SLOW_PAGE)

  await page.getByRole('link', { name: 'Voltar ao geral' }).click()
  await expect(page).toHaveURL(/\/historico\?cat=sub14$/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)
})

test('history overview opens an athlete from the period top scorers', async ({ page }) => {
  await page.goto('/historico')

  await page.getByTitle('Abrir a ficha do atleta').first().click()

  await expect(page).toHaveURL(/\/historico\/atletas\/[0-9a-f-]{36}/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Temporada por temporada' })).toBeVisible(SLOW_PAGE)
})

test('history highlight card of the top scorer opens the athlete page', async ({ page }) => {
  await page.goto('/historico')

  await page.getByRole('link', { name: /Maior artilheiro/ }).click()

  await expect(page).toHaveURL(/\/historico\/atletas\//, SLOW_PAGE)
  await expect(page.getByText('Gols por temporada')).toBeVisible(SLOW_PAGE)
})
