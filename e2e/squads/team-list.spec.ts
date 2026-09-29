import { expect, test } from '@playwright/test'
import { rosterRows, SLOW_PAGE, teamItems } from '../support/squads/squads'
import { urlContaining } from '../support/url/url'

test.skip(({ isMobile }) => isMobile, 'A lista de times é testada no layout de desktop.')

test('squads page opens on the first team of the season with its roster', async ({ page }) => {
  await page.goto('/elencos')

  await expect(page).toHaveTitle('Elencos · sub.tv')
  await expect(page.getByText(/Vínculos por clube e categoria · elenco \d{4}/)).toBeVisible(SLOW_PAGE)
  await expect(page.locator('[data-active-team]')).toBeVisible(SLOW_PAGE)
  await expect(page.getByRole('region', { name: 'Elenco' }).getByText(/Atletas vinculados/)).toBeVisible()
  await expect(rosterRows(page).first()).toBeVisible()
})

test('choosing another team in the list shows its roster and marks it as active', async ({ page }) => {
  await page.goto('/elencos')
  const secondTeam = teamItems(page).nth(1)
  const href = (await secondTeam.getAttribute('href')) ?? ''
  const teamKey = new URLSearchParams(href.split('?')[1]).get('time') ?? ''

  await secondTeam.click()

  await expect(page).toHaveURL(urlContaining(`time=${teamKey}`), SLOW_PAGE)
  await expect(teamItems(page).and(page.locator('[aria-current="true"]'))).toHaveAttribute('href', href, SLOW_PAGE)
})

test('category filter keeps only the teams of the chosen category', async ({ page }) => {
  await page.goto('/elencos')
  const categoryFilter = page.getByRole('navigation', { name: 'Filtro de categoria' })

  await categoryFilter.getByRole('link', { name: 'SUB-14' }).click()

  await expect(page).toHaveURL(/cat=sub14/, SLOW_PAGE)
  await expect(categoryFilter.getByRole('link', { name: 'SUB-14' })).toHaveAttribute('aria-current', 'true')
  const teamTexts = await teamItems(page).allInnerTexts()
  expect(teamTexts.length).toBeGreaterThan(0)
  expect(teamTexts.every((text) => text.includes('SUB-14'))).toBe(true)

  await categoryFilter.getByRole('link', { name: 'Todas' }).click()
  await expect(page).not.toHaveURL(/cat=/, SLOW_PAGE)
})

test('squads of a past season are opened from the season rail', async ({ page }) => {
  await page.goto('/elencos')

  await page.getByRole('button', { name: 'Todas as temporadas' }).click()
  await page.getByRole('link', { name: /^2019/ }).click()

  await expect(page).toHaveURL(/temporada=2019/, SLOW_PAGE)
  await expect(page.getByText('Vínculos por clube e categoria · elenco 2019')).toBeVisible(SLOW_PAGE)
})
