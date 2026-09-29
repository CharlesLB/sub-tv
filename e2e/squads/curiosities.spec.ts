import { expect, test } from '@playwright/test'
import { deleteCuriositiesStartingWith } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { openFirstPlayer, playerSheet } from '../support/squads/squads'

const CURIOSITY_PREFIX = 'Curiosidade E2E de elencos'

test.skip(({ isMobile }) => isMobile, 'As curiosidades são testadas no layout de desktop.')

test.afterEach(async () => {
  await deleteCuriositiesStartingWith(CURIOSITY_PREFIX)
})

test('adding a curiosity lists it on the player sheet and it stays after a reload', async ({ page }) => {
  const curiosityText = `${CURIOSITY_PREFIX} ${Date.now()}`
  await signIn(page, '/elencos')
  await openFirstPlayer(page)
  const sheet = playerSheet(page)

  await sheet.getByRole('textbox', { name: 'Nova curiosidade' }).fill(curiosityText)
  await sheet.getByRole('button', { name: 'Adicionar' }).click()

  await expect(sheet.getByRole('listitem').filter({ hasText: curiosityText })).toBeVisible()
  await expect(sheet.getByRole('textbox', { name: 'Nova curiosidade' })).toHaveValue('')
  await page.reload()
  await expect(playerSheet(page).getByRole('listitem').filter({ hasText: curiosityText })).toBeVisible({ timeout: 20_000 })
})

test('removing a curiosity takes it off the player sheet', async ({ page }) => {
  const curiosityText = `${CURIOSITY_PREFIX} ${Date.now()}`
  await signIn(page, '/elencos')
  await openFirstPlayer(page)
  const sheet = playerSheet(page)
  await sheet.getByRole('textbox', { name: 'Nova curiosidade' }).fill(curiosityText)
  await sheet.getByRole('button', { name: 'Adicionar' }).click()
  const addedCuriosity = sheet.getByRole('listitem').filter({ hasText: curiosityText })
  await expect(addedCuriosity).toBeVisible()

  await addedCuriosity.getByRole('button', { name: 'Remover curiosidade' }).click()

  await expect(sheet.getByText(curiosityText)).toHaveCount(0)
  await page.reload()
  await expect(playerSheet(page).getByRole('heading', { name: 'Ficha do jogador' })).toBeVisible({ timeout: 20_000 })
  await expect(playerSheet(page).getByText(curiosityText)).toHaveCount(0)
})

test('adding an empty curiosity shows the validation message', async ({ page }) => {
  await signIn(page, '/elencos')
  await openFirstPlayer(page)
  const sheet = playerSheet(page)

  await sheet.getByRole('textbox', { name: 'Nova curiosidade' }).fill('   ')
  await sheet.getByRole('button', { name: 'Adicionar' }).click()

  await expect(sheet.getByRole('alert').getByText('Escreva a curiosidade.')).toBeVisible({ timeout: 15_000 })
})
