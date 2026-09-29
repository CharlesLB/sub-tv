import { expect, type Page, test } from '@playwright/test'
import { urlContaining } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }
const YEAR_CHIP = /^20\d\d$/

const yearChips = (page: Page) => page.getByRole('link', { name: YEAR_CHIP })

test('category filter narrows the history to one category and marks it as active', async ({ page }) => {
  await page.goto('/historico')

  await page.getByRole('link', { name: 'SUB-14', exact: true }).click()

  await expect(page).toHaveURL(/cat=sub14/, SLOW_PAGE)
  await expect(page.getByRole('link', { name: 'SUB-14', exact: true })).toHaveAttribute('aria-current', 'true')

  const categories = await page
    .getByRole('region', { name: 'Classificação acumulada por time' })
    .getByTitle('Abrir a página do time')
    .evaluateAll((rows) => rows.map((row) => row.getAttribute('href')))

  expect(categories.every((href) => href?.includes('/historico/times/sub14-'))).toBe(true)
})

test('choosing one season from all seasons selects only that year', async ({ page }) => {
  await page.goto('/historico?cat=sub14')
  const year = ((await yearChips(page).first().textContent()) ?? '').trim()

  await yearChips(page).first().click()

  await expect(page).toHaveURL(urlContaining(`temporadas=${year}`), SLOW_PAGE)
  await expect(page.getByText(`Temporada ${year}`)).toBeVisible(SLOW_PAGE)
  await expect(yearChips(page).and(page.locator('[aria-current="true"]'))).toHaveCount(1)
})

test('adding a second season to the filter shows the combined range', async ({ page }) => {
  await page.goto('/historico')
  const firstYear = ((await yearChips(page).nth(0).textContent()) ?? '').trim()
  const secondYear = ((await yearChips(page).nth(1).textContent()) ?? '').trim()
  await yearChips(page).nth(0).click()
  await expect(page).toHaveURL(urlContaining(`temporadas=${firstYear}`), SLOW_PAGE)

  await page.getByRole('link', { name: secondYear, exact: true }).click()

  await expect(page).toHaveURL(/temporadas=\d{4}(%2C|,)\d{4}/, SLOW_PAGE)
  await expect(page.getByText(/2 Temporadas · \d{4}–\d{4}/i)).toBeVisible(SLOW_PAGE)
})

test('the all seasons chip clears the season filter', async ({ page }) => {
  await page.goto('/historico?temporadas=2023')
  await expect(page.getByText('Temporada 2023')).toBeVisible(SLOW_PAGE)

  await page.getByRole('link', { name: 'Todas', exact: true }).nth(1).click()

  await expect(page).not.toHaveURL(/temporadas=/, SLOW_PAGE)
  await expect(page.getByText(/Todas as temporadas · \d{4}–\d{4}/)).toBeVisible(SLOW_PAGE)
})
