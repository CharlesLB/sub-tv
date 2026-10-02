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

  await expect(page).toHaveURL(/\/elencos\/2019/, SLOW_PAGE)
  await expect(page.getByText('Vínculos por clube e categoria · elenco 2019')).toBeVisible(SLOW_PAGE)
})

test('switching teams keeps the team list on screen and only reloads the squad', async ({ page }) => {
  await page.goto('/elencos')
  const teamList = page.getByRole('complementary', { name: 'Times' })
  await expect(teamItems(page).nth(1)).toBeVisible(SLOW_PAGE)
  await teamList.evaluate((element) => element.setAttribute('data-kept', 'true'))

  await teamItems(page).nth(1).click()

  await expect(page).toHaveURL(/time=/, SLOW_PAGE)
  await expect(page.getByRole('region', { name: 'Elenco' })).toBeVisible(SLOW_PAGE)
  await expect(page.getByRole('complementary', { name: 'Times' })).toHaveAttribute('data-kept', 'true')
})

test('an old squads address with the season in the query opens the same season', async ({ page }) => {
  await page.goto('/elencos?temporada=2019&cat=sub14')

  await expect(page).toHaveURL(/\/elencos\/2019\?cat=sub14/, SLOW_PAGE)
  await expect(page.getByText('Vínculos por clube e categoria · elenco 2019')).toBeVisible(SLOW_PAGE)
})

test('choosing a player shows the loading bar while the page refreshes', async ({ page, context }) => {
  await page.goto('/elencos')
  await expect(rosterRows(page).nth(1)).toBeVisible(SLOW_PAGE)
  await page.waitForLoadState('networkidle')
  const network = await context.newCDPSession(page)
  await network.send('Network.enable')
  await network.send('Network.emulateNetworkConditions', { offline: false, latency: 800, downloadThroughput: -1, uploadThroughput: -1 })

  await rosterRows(page).nth(1).click()

  await expect(page.getByRole('progressbar', { name: 'Carregando página' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Carregando página' })).toBeHidden(SLOW_PAGE)
})
