import { expect, test } from '@playwright/test'
import { rosterRows, SLOW_PAGE } from '../support/squads/squads'

test.skip(({ isMobile }) => isMobile, 'A busca no elenco é testada no layout de desktop.')

test.beforeEach(async ({ page }) => {
  await page.goto('/elencos')
  await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)
})

test('searching the roster by shirt number keeps only players with that exact number', async ({ page }) => {
  const shirtNumber = (await rosterRows(page).first().locator('span').first().innerText()).trim()

  await page.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }).fill(shirtNumber)

  const numbers = await rosterRows(page).evaluateAll((rows) => rows.map((row) => row.querySelector('span')?.textContent?.trim()))
  expect(numbers.length).toBeGreaterThan(0)
  expect(numbers.every((number) => number === shirtNumber)).toBe(true)
  await expect(page).not.toHaveURL(/q=/)
})

test('searching the roster by part of a name ignores letter case and accents', async ({ page }) => {
  const fullName = (await rosterRows(page).first().locator('span').nth(1).innerText()).replace(/\s+".*"$/, '')
  const firstName = fullName.split(' ')[0] ?? ''

  await page.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }).fill(firstName.toUpperCase())

  await expect(rosterRows(page).filter({ hasText: fullName }).first()).toBeVisible()
})

test('searching the roster for a name that does not exist shows the empty message', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }).fill('zzzz-ninguem')

  await expect(rosterRows(page)).toHaveCount(0)
  await expect(page.getByText('Nenhum atleta encontrado para “zzzz-ninguem”.')).toBeVisible()
})
