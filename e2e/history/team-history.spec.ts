import { expect, type Page, test } from '@playwright/test'
import { urlContaining, urlEndingWith } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }

const openFirstTeam = async (page: Page) => {
  await page.goto('/historico')
  await page.getByTitle('Abrir a página do time').first().click()
  await expect(page).toHaveURL(/\/historico\/times\/sub1[34]-/, SLOW_PAGE)
}

test('team history shows the campaign numbers, the points chart and the per season campaign', async ({ page }) => {
  await openFirstTeam(page)

  await expect(page).toHaveTitle('Histórico do time · sub.tv')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/ SUB-1[34]$/)
  await expect(page.getByText('Aproveitamento').first()).toBeVisible()
  await expect(page.getByText('Saldo de gols')).toBeVisible()
  await expect(page.getByRole('figure', { name: 'Pontos por temporada' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Artilheiros do time' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Presenças por campeonato' })).toBeVisible()
})

test('team history season row opens the championships of that season', async ({ page }) => {
  await openFirstTeam(page)
  const seasonRow = page.getByTitle(/^Abrir a temporada \d{4}$/).first()
  const year = /(\d{4})$/.exec((await seasonRow.getAttribute('title')) ?? '')?.[1] ?? ''

  await seasonRow.click()

  await expect(page).toHaveURL(urlEndingWith(`/campeonatos?temporada=${year}`), SLOW_PAGE)
})

test('team history top scorer opens the athlete page', async ({ page }) => {
  await openFirstTeam(page)
  const scorer = page.locator('a[href^="/historico/atletas/"]').first()

  await scorer.click()

  await expect(page).toHaveURL(/\/historico\/atletas\//, SLOW_PAGE)
})

test('team history filtered to one season keeps only that season in the campaign', async ({ page }) => {
  await openFirstTeam(page)
  const seasonRow = page.getByTitle(/^Abrir a temporada \d{4}$/).first()
  const year = /(\d{4})$/.exec((await seasonRow.getAttribute('title')) ?? '')?.[1] ?? ''

  await page.getByRole('link', { name: year, exact: true }).click()

  await expect(page).toHaveURL(urlContaining(`temporadas=${year}`), SLOW_PAGE)
  await expect(page.getByTitle(/^Abrir a temporada \d{4}$/)).toHaveCount(1, SLOW_PAGE)
  await expect(page.getByTitle(`Abrir a temporada ${year}`)).toBeVisible()
})
