import { expect, test } from '@playwright/test'
import { openFirstPlayer, playerSheet, rosterRows, SLOW_PAGE } from '../support/squads/squads'

test.skip(({ isMobile }) => isMobile, 'A leitura do elenco é testada no layout de desktop.')

test('signed-out visitor reads the player sheet without any editing control', async ({ page }) => {
  await page.goto('/elencos')
  await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)

  await openFirstPlayer(page)

  const sheet = playerSheet(page)
  await expect(sheet.getByLabel('Apelido (como o narrador chama)')).toHaveCount(0)
  await expect(sheet.locator('input[type="radio"]')).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Adicionar' })).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Remover curiosidade' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /novo jogador/ })).toHaveCount(0)
})

test('signed-out visitor follows the sign-in link on the sheet and comes back to the same player', async ({ page }) => {
  await page.goto('/elencos')
  const playerId = await openFirstPlayer(page)
  const signInLink = playerSheet(page).getByRole('link', { name: 'Entre para editar esta ficha' })
  await expect(signInLink).toHaveAttribute('href', /^\/entrar\?para=%2Felencos%3F.*atleta%3D/)

  await signInLink.click()

  await expect(page).toHaveURL(/\/entrar\?para=/)
  await expect(page.getByRole('heading', { name: 'Acesso da equipe' })).toBeVisible()
  expect(decodeURIComponent(page.url())).toContain(`atleta=${playerId}`)
})
