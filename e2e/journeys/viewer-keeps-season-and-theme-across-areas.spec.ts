import { expect, test } from '@playwright/test'
import { teamItems } from '../support/squads/squads'
import { urlContaining } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }
const THEME_ATTRIBUTE = 'data-tema'
const DARK_THEME = 'escuro'
const CHOSEN_YEAR = '2019'

test.skip(({ isMobile }) => isMobile, 'O trilho lateral é testado no layout de desktop.')

test('viewer picks an old season and the dark theme, and both follow them through championships, squads and history', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: 'Principal' })
  const trail = page.getByRole('navigation', { name: 'Trilha de navegação' })
  const html = page.locator('html')

  await test.step('switches to the dark theme and picks 2019 in the season panel', async () => {
    await page.goto('/campeonatos')
    await page.getByRole('button', { name: 'Mudar para o modo escuro' }).click()
    await expect(html).toHaveAttribute(THEME_ATTRIBUTE, DARK_THEME)

    await page.getByRole('button', { name: 'Todas as temporadas' }).click()
    await page.getByRole('link', { name: new RegExp(`^${CHOSEN_YEAR}`) }).click()

    await expect(page).toHaveURL(urlContaining(`temporada=${CHOSEN_YEAR}`), SLOW_PAGE)
    await expect(trail).toContainText(CHOSEN_YEAR)
  })

  await test.step('opens a 2019 championship from the ribbon', async () => {
    const ribbonChip = page.locator('a[href^="/campeonatos/"]:has-text("SUB-1")').first()

    await ribbonChip.click()

    await expect(page).toHaveURL(/\/campeonatos\/[0-9a-f-]{36}/, SLOW_PAGE)
    await expect(trail).toContainText(CHOSEN_YEAR, SLOW_PAGE)
  })

  await test.step('goes to the squads of the same season and chooses a team', async () => {
    await rail.getByRole('link', { name: 'Elencos' }).click()

    await expect(page).toHaveURL(new RegExp(`/elencos/${CHOSEN_YEAR}`), SLOW_PAGE)
    await expect(trail).toContainText(CHOSEN_YEAR)
    await expect(teamItems(page).nth(1)).toBeVisible(SLOW_PAGE)
    await teamItems(page).nth(1).click()
    await expect(page).toHaveURL(/time=/, SLOW_PAGE)
  })

  await test.step('clicking squads in the rail again goes back to the root of the season without the team', async () => {
    await rail.getByRole('link', { name: 'Elencos' }).click()

    await expect(page).toHaveURL((url) => url.pathname === `/elencos/${CHOSEN_YEAR}` && !url.searchParams.has('time'), SLOW_PAGE)
    await expect(page.getByRole('navigation', { name: 'Filtro de categoria' }).getByRole('link', { name: 'Todas' })).toHaveAttribute('aria-current', 'true')
  })

  await test.step('visits the history and comes back to the championships of the remembered season', async () => {
    await rail.getByRole('link', { name: 'Histórico' }).click()
    await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)
    await expect(html).toHaveAttribute(THEME_ATTRIBUTE, DARK_THEME)

    await rail.getByRole('link', { name: 'Campeonatos', exact: true }).click()

    await expect(page).toHaveURL(urlContaining(`temporada=${CHOSEN_YEAR}`), SLOW_PAGE)
    await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)
  })

  await test.step('keeps the dark theme and the season after reloading the page', async () => {
    await page.reload()

    await expect(html).toHaveAttribute(THEME_ATTRIBUTE, DARK_THEME)
    await expect(trail).toContainText(CHOSEN_YEAR, SLOW_PAGE)
  })
})
