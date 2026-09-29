import { expect, test } from '@playwright/test'
import { urlContaining, urlEndingWith } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }
const YEAR_PATTERN = /^\d{4}/

test('season panel lists every season and switching year updates the championship list', async ({ page }) => {
  await page.goto('/campeonatos')

  await page.getByRole('button', { name: 'Todas as temporadas' }).click()
  await expect(page.getByText('Elenco próprio por ano')).toBeVisible()
  await page.getByRole('link', { name: /^2017/ }).click()

  await expect(page).toHaveURL(/temporada=2017/, SLOW_PAGE)
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' })).toContainText('2017')
  await expect(page.getByText('Elenco próprio por ano')).toHaveCount(0)
})

test('year axis marks the active year and opening another year loads its championships', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2019')
  const activeYear = page.locator('a[aria-current="true"][title*="campeonatos · elenco"]')
  await expect(activeYear).toContainText('2019')

  const otherYear = page.locator('a[title*="campeonatos · elenco"]:not([aria-current="true"])').first()
  const otherYearText = ((await otherYear.textContent()) ?? '').match(YEAR_PATTERN)?.[0] ?? ''
  await otherYear.click()

  await expect(page).toHaveURL(urlContaining(`temporada=${otherYearText}`), SLOW_PAGE)
  await expect(page.locator('a[aria-current="true"][title*="campeonatos · elenco"]')).toContainText(otherYearText)
})

test('season chosen on the rail is remembered when coming back to the championship list without a year', async ({ page }) => {
  await page.goto('/campeonatos')
  await page.getByRole('button', { name: 'Todas as temporadas' }).click()
  await page.getByRole('link', { name: /^2018/ }).click()
  await expect(page).toHaveURL(/temporada=2018/, SLOW_PAGE)

  await page.goto('/campeonatos')

  await expect(page).toHaveURL(/temporada=2018/, SLOW_PAGE)
})

test('championship ribbon opens a championship of the active season and marks it as current', async ({ page }) => {
  await page.goto('/campeonatos')
  const ribbonChip = page.locator('a[href^="/campeonatos/"]:has-text("SUB-1")').first()
  const href = (await ribbonChip.getAttribute('href')) ?? ''

  await ribbonChip.click()

  await expect(page).toHaveURL(urlEndingWith(href), SLOW_PAGE)
  await expect(page.locator(`a[href="${href}"][aria-current="page"]`)).toBeVisible(SLOW_PAGE)
})
