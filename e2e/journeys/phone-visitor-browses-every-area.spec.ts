import { expect, test } from '@playwright/test'
import { rosterRows, SLOW_PAGE } from '../support/squads/squads'

test.skip(({ isMobile }) => !isMobile, 'Esta jornada cobre o layout de celular.')

test('visitor on a phone moves between championships, squads and history with the bottom tab bar', async ({ page }) => {
  const tabBar = page.getByRole('navigation', { name: 'Principal' })

  await test.step('opens a championship from the list', async () => {
    await page.goto('/campeonatos')
    await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)

    await page
      .getByRole('link', { name: /Abrir campeonato/ })
      .first()
      .click()

    await expect(page).toHaveURL(/\/campeonatos\/[0-9a-f-]{36}/, SLOW_PAGE)
    await expect(page.getByRole('navigation', { name: 'Seções do campeonato' })).toBeVisible()
  })

  await test.step('switches to the squads and reads a player sheet', async () => {
    await tabBar.getByRole('link', { name: 'Elencos' }).click()
    await expect(page).toHaveURL(/\/elencos/, SLOW_PAGE)
    await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)

    await rosterRows(page).first().click()

    await expect(page).toHaveURL(/atleta=/, SLOW_PAGE)
    await expect(page.getByRole('complementary', { name: 'Ficha do jogador' })).toBeVisible(SLOW_PAGE)
  })

  await test.step('switches to the history and opens a team page', async () => {
    await tabBar.getByRole('link', { name: 'Histórico' }).click()
    await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)

    await page.getByTitle('Abrir a página do time').first().click()

    await expect(page).toHaveURL(/\/historico\/times\//, SLOW_PAGE)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/ SUB-1[34]$/)
  })

  await test.step('goes back to the championships list from the tab bar', async () => {
    await tabBar.getByRole('link', { name: 'Campeonatos', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)
    await expect(tabBar.getByRole('link', { name: 'Campeonatos', exact: true })).toHaveAttribute('aria-current', 'page')
  })
})
