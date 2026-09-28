import { expect, type Page, test } from '@playwright/test'
import { signIn } from './sign-in'

const NICKNAME = 'Apelido E2E'
const CURIOSITY_TEXT = 'Curiosidade E2E de elencos'

test.skip(({ isMobile }) => isMobile, 'the squads flow is covered on the desktop layout')

const rosterRows = (page: Page) => page.getByRole('region', { name: 'Elenco' }).locator('a[href*="atleta="]')

test('squads screen opens a team, finds a player by number, edits the nickname and curiosities, then restores them', async ({ page }) => {
  await signIn(page, '/elencos')
  const teams = page.getByRole('complementary', { name: 'Times' }).locator('a:has(span.hexagon)')
  const chosenTeam = teams.nth(1)
  const teamHref = (await chosenTeam.getAttribute('href')) ?? ''
  await chosenTeam.click()
  await page.waitForURL((url) => `${url.pathname}${url.search}` === teamHref)
  await expect(page.locator('[data-active-team]')).toBeVisible()

  const firstRow = rosterRows(page).first()
  await expect(firstRow).toBeVisible()
  const shirtNumber = (await firstRow.locator('span').first().innerText()).trim()
  await page.getByPlaceholder('buscar nome ou número').fill(shirtNumber)
  const matchingRows = rosterRows(page)
  await expect(matchingRows.first()).toBeVisible()
  const matchingNumbers = await matchingRows.evaluateAll((rows) => rows.map((row) => row.querySelector('span')?.textContent?.trim()))
  expect(matchingNumbers.every((number) => number === shirtNumber)).toBe(true)

  const chosenRow = matchingRows.first()
  const fullName = (await chosenRow.locator('span').nth(1).innerText()).replace(/\s+".*"$/, '')
  await chosenRow.click()
  await expect(page).toHaveURL(/atleta=/)
  const sheet = page.getByRole('complementary', { name: 'Ficha do jogador' })
  await expect(sheet.locator('input[disabled]').nth(1)).toHaveValue(fullName)

  const nicknameInput = sheet.locator('input[name="displayName"]')
  const originalNickname = await nicknameInput.inputValue()
  await nicknameInput.fill(NICKNAME)
  await nicknameInput.press('Enter')
  await expect(page.locator('a[aria-current="true"][href*="atleta="]')).toContainText(`"${NICKNAME}"`)
  await expect(sheet.getByText(/Última alteração: /)).toBeVisible({ timeout: 15_000 })

  await sheet.getByPlaceholder('nova curiosidade').fill(CURIOSITY_TEXT)
  await sheet.getByRole('button', { name: 'Adicionar' }).click()
  await expect(sheet.getByText(CURIOSITY_TEXT)).toBeVisible()
  await expect(sheet.getByRole('button', { name: 'Remover curiosidade' }).last()).toBeVisible()
  await sheet.locator('li', { hasText: CURIOSITY_TEXT }).getByRole('button', { name: 'Remover curiosidade' }).click()
  await expect(sheet.getByText(CURIOSITY_TEXT)).toHaveCount(0)

  await nicknameInput.fill(originalNickname)
  await nicknameInput.press('Enter')
  await expect(sheet.getByText('Salvo')).toBeVisible()
  const restoredRow = page.locator('a[aria-current="true"][href*="atleta="]')
  if (originalNickname) await expect(restoredRow).toContainText(`"${originalNickname}"`)
  else await expect(restoredRow).not.toContainText('"')
})

test('signed-out visitor sees squads and championships read-only with a link to sign in', async ({ page }) => {
  await page.goto('/elencos')
  await expect(page).toHaveURL(/\/elencos/)

  await rosterRows(page).first().click()
  await expect(page).toHaveURL(/atleta=/)
  const sheet = page.getByRole('complementary', { name: 'Ficha do jogador' })
  await expect(sheet.getByRole('heading', { name: 'Ficha do jogador' })).toBeVisible()
  await expect(sheet.locator('input[name="displayName"]')).toHaveCount(0)
  await expect(sheet.locator('input[type="radio"]')).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Adicionar' })).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Remover curiosidade' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /novo jogador/ })).toHaveCount(0)
  await expect(sheet.getByRole('link', { name: 'Entre para editar esta ficha' })).toHaveAttribute('href', /^\/entrar\?para=%2Felencos%3F.*atleta%3D/)

  await page.goto('/campeonatos')
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Novo campeonato/ })).toHaveCount(0)
})
