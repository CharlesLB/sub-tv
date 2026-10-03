import { expect, test } from '@playwright/test'
import { E2E_PASSWORD, E2E_USERNAME } from '../support/credentials/credentials'
import { fillSignInForm } from '../support/sign-in/sign-in'
import { playerSheet, rosterRows, SLOW_PAGE } from '../support/squads/squads'
import { urlContaining } from '../support/url/url'

const SELECTED_ROW = 'a[aria-current="true"][href*="atleta="]'

test.skip(({ isMobile }) => isMobile, 'A jornada de entrar para editar é testada no layout de desktop.')

test('visitor reading a player sheet signs in from it, comes back to the same player with editing controls and signs out again', async ({ page }) => {
  const { playerId, playerName } = await test.step('opens the third player of the squad as a visitor', async () => {
    await page.goto('/elencos')
    await expect(rosterRows(page).nth(2)).toBeVisible(SLOW_PAGE)
    const row = rosterRows(page).nth(2)

    const name =
      (await row.innerText())
        .split('\n')
        .find((line) => line.trim().length > 3)
        ?.trim() ?? ''

    await row.click()

    await expect(page).toHaveURL(/atleta=/, SLOW_PAGE)
    await expect(playerSheet(page).getByRole('textbox', { name: 'Nova curiosidade' })).toHaveCount(0)

    return { playerId: new URL(page.url()).searchParams.get('atleta') ?? '', playerName: name }
  })

  await test.step('follows the sign-in link of the sheet and signs in', async () => {
    await playerSheet(page).getByRole('link', { name: 'Entre para editar esta ficha' }).click()
    await expect(page.getByRole('heading', { name: 'Acesso da equipe' })).toBeVisible(SLOW_PAGE)

    await fillSignInForm(page, E2E_USERNAME, E2E_PASSWORD)

    await expect(page).toHaveURL(urlContaining(`atleta=${playerId}`), SLOW_PAGE)
  })

  await test.step('is back on the same player, now with the editing controls', async () => {
    await expect(page.locator(SELECTED_ROW)).toContainText(playerName, SLOW_PAGE)
    await expect(playerSheet(page).getByRole('textbox', { name: 'Nova curiosidade' })).toBeVisible()
    await expect(playerSheet(page).getByLabel('Apelido (como o narrador chama)')).toBeVisible()
  })

  await test.step('signs out and the sheet goes back to read only', async () => {
    await page.getByRole('button', { name: 'Sair' }).click()
    await page.waitForURL(/\/entrar$/)

    await page.goBack()
    await page.reload()

    await expect(playerSheet(page).getByRole('heading', { name: 'Ficha do jogador' })).toBeVisible(SLOW_PAGE)
    await expect(playerSheet(page).getByRole('textbox', { name: 'Nova curiosidade' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toBeVisible()
  })
})
