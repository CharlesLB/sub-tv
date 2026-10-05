import { expect, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

test('main navigation rail marks the current area and moves between championships, squads and history', async ({ page }) => {
  await page.goto('/campeonatos')
  const rail = page.getByRole('navigation', { name: 'Principal' })
  await expect(rail.getByRole('link', { name: 'Campeonatos', exact: true })).toHaveAttribute('aria-current', 'page')

  await rail.getByRole('link', { name: 'Elencos' }).click()
  await expect(page).toHaveURL(/\/elencos/, SLOW_PAGE)
  await expect(rail.getByRole('link', { name: 'Elencos' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('heading', { name: 'Elencos', level: 1 })).toBeVisible(SLOW_PAGE)

  await rail.getByRole('link', { name: 'Histórico' }).click()
  await expect(page).toHaveURL(/\/historico/, SLOW_PAGE)
  await expect(rail.getByRole('link', { name: 'Histórico' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)

  await rail.getByRole('link', { name: 'Campeonatos', exact: true }).click()
  await expect(page).toHaveURL(/\/campeonatos/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)
})

test('main navigation rail keeps the selected season when switching from championships to squads', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2019')
  const rail = page.getByRole('navigation', { name: 'Principal' })

  await expect(rail.getByRole('link', { name: 'Elencos' })).toHaveAttribute('href', '/elencos/2019')
  await rail.getByRole('link', { name: 'Elencos' }).click()

  await expect(page).toHaveURL(/\/elencos\/2019/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Elencos', level: 1 })).toBeVisible(SLOW_PAGE)
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' }).filter({ hasText: 'Gestão da base' })).toContainText('2019')
})

test('breadcrumb trail on a championship links back to the championship list of its season', async ({ page }) => {
  await page.goto('/campeonatos')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await expect(page).toHaveURL(/\/campeonatos\/[0-9a-f-]{36}/, SLOW_PAGE)
  const trail = page.getByRole('navigation', { name: 'Trilha de navegação' })
  await expect(trail.getByRole('link', { name: 'Campeonatos' })).toHaveAttribute('href', /temporada=\d{4}/)

  await trail.getByRole('link', { name: 'Campeonatos' }).click()

  await expect(page).toHaveURL(/\/campeonatos\?temporada=\d{4}$/, SLOW_PAGE)
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)
})
