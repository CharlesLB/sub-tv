import { expect, type Page, test } from '@playwright/test'
import { deleteManualPlayersStartingWith } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { playerSheet, rosterRows, SLOW_PAGE, SLOW_SERVER_ACTION } from '../support/squads/squads'

const NEW_PLAYER_PREFIX = 'Jogador Provisorio E2E'
const UNUSED_SHIRT_NUMBER = '98'

test.skip(({ isMobile }) => isMobile, 'O cadastro manual é testado no layout de desktop.')

test.afterEach(async () => {
  await deleteManualPlayersStartingWith(NEW_PLAYER_PREFIX)
})

const uniquePlayerName = (): string => `${NEW_PLAYER_PREFIX} ${Date.now()}`

const openNewPlayerForm = async (page: Page) => {
  await signIn(page, '/elencos')
  await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)
  await page.getByRole('button', { name: /novo jogador SUB-1[34]/ }).click()
  await expect(page.getByText(/^Novo jogador SUB-1[34]/)).toBeVisible()
}

test('registering a new player adds them to the roster and opens their sheet', async ({ page }) => {
  const newPlayerName = uniquePlayerName()
  await openNewPlayerForm(page)

  await page.getByLabel('Número').last().fill(UNUSED_SHIRT_NUMBER)
  await page.getByLabel('Nome completo').fill(newPlayerName)
  await page.getByRole('button', { name: 'Cadastrar', exact: true }).click()

  await expect(page).toHaveURL(/atleta=/, SLOW_SERVER_ACTION)
  await expect(rosterRows(page).filter({ hasText: newPlayerName })).toBeVisible(SLOW_SERVER_ACTION)
  await expect(playerSheet(page).locator('input[disabled]').nth(1)).toHaveValue(newPlayerName)
})

test('registering a player with a shirt number already used by the team shows the conflict', async ({ page }) => {
  const newPlayerName = uniquePlayerName()
  await openNewPlayerForm(page)
  const takenNumber = (await rosterRows(page).first().locator('span').first().innerText()).trim()

  await page.getByLabel('Número').last().fill(takenNumber)
  await page.getByLabel('Nome completo').fill(newPlayerName)
  await page.getByRole('button', { name: 'Cadastrar', exact: true }).click()

  await expect(page.getByRole('alert').getByText(`Número ${takenNumber} já está em uso`)).toBeVisible(SLOW_SERVER_ACTION)
})

test('cancelling the new player form closes it without registering anyone', async ({ page }) => {
  const newPlayerName = uniquePlayerName()
  await openNewPlayerForm(page)
  await page.getByLabel('Nome completo').fill(newPlayerName)

  await page.getByRole('button', { name: 'Cancelar' }).click()

  await expect(page.getByLabel('Nome completo')).toHaveCount(0)
  await expect(rosterRows(page).filter({ hasText: newPlayerName })).toHaveCount(0)
})
