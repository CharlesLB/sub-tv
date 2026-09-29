import { expect, type Locator, type Page } from '@playwright/test'

export const SLOW_PAGE = { timeout: 20_000 }
export const SLOW_SERVER_ACTION = { timeout: 15_000 }

export const rosterRows = (page: Page): Locator => page.getByRole('region', { name: 'Elenco' }).locator('a[href*="atleta="]')

export const playerSheet = (page: Page): Locator => page.getByRole('complementary', { name: 'Ficha do jogador' })

export const teamItems = (page: Page): Locator => page.getByRole('complementary', { name: 'Times' }).locator('a[href*="time="]:not(nav a)')

export const openFirstPlayer = async (page: Page): Promise<string> => {
  await rosterRows(page).first().click()
  await expect(page).toHaveURL(/atleta=/, SLOW_PAGE)
  await expect(playerSheet(page).getByRole('heading', { name: 'Ficha do jogador' })).toBeVisible(SLOW_PAGE)

  return new URL(page.url()).searchParams.get('atleta') ?? ''
}
