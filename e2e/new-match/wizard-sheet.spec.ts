import { expect, test } from '@playwright/test'
import { findSeasonReadyForNewMatch } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { urlEndingWith } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }

test('new match button on a championship opens the wizard as a sheet and closing it returns to the championship', async ({ page }) => {
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, 'Nenhum campeonato com dois elencos completos no banco.')
  await signIn(page, `/campeonatos/${seasonId}`)

  await page.getByRole('link', { name: 'Nova partida' }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Nova partida' })
  await expect(sheet).toBeVisible(SLOW_PAGE)
  await expect(page).toHaveURL(/\/nova-partida$/)

  await sheet.getByRole('button', { name: 'Fechar' }).click()

  await expect(sheet).toHaveCount(0)
  await expect(page).toHaveURL(urlEndingWith(`/campeonatos/${seasonId}`))
})

test('new match sheet closes with the Escape key', async ({ page }) => {
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, 'Nenhum campeonato com dois elencos completos no banco.')
  await signIn(page, `/campeonatos/${seasonId}`)
  await page.getByRole('link', { name: 'Nova partida' }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Nova partida' })
  await expect(sheet).toBeVisible(SLOW_PAGE)

  await page.keyboard.press('Escape')

  await expect(sheet).toHaveCount(0)
  await expect(page).toHaveURL(urlEndingWith(`/campeonatos/${seasonId}`))
})
