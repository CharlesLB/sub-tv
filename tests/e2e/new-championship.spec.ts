import { expect, test } from '@playwright/test'
import { countSquadMembersOf, deleteChampionshipsNamed } from './database'
import { signIn } from './sign-in'

const CHAMPIONSHIP_NAME = 'Copa E2E Automatizada'
const CHAMPIONSHIP_URL = /\/campeonatos\/[0-9a-f-]{36}/

test.afterAll(async () => {
  await deleteChampionshipsNamed(CHAMPIONSHIP_NAME)
})

test('creating a championship with two clubs shows it in the list and opens it with copied squads', async ({ page }) => {
  await deleteChampionshipsNamed(CHAMPIONSHIP_NAME)
  await signIn(page, '/campeonatos')

  await page.getByRole('button', { name: 'Novo campeonato SUB-14' }).click()
  await page.getByPlaceholder('ex.: COPA DO VALE').fill(CHAMPIONSHIP_NAME)
  const clubOptions = page.locator('label:has(input[name="clubId"])')
  await clubOptions.nth(0).click()
  await clubOptions.nth(1).click()
  await expect(page.getByText('2 selecionados')).toBeVisible()
  await page.getByRole('button', { name: 'Criar campeonato' }).click()

  await expect(page).toHaveURL(CHAMPIONSHIP_URL, { timeout: 15_000 })
  await expect(page.getByRole('status').getByText('Campeonato criado')).toBeVisible()
  await expect(page.getByRole('heading', { name: CHAMPIONSHIP_NAME })).toBeVisible()
  const seasonId = new URL(page.url()).pathname.split('/')[2] ?? ''
  expect(await countSquadMembersOf(seasonId)).toBeGreaterThan(0)

  await page.goto('/campeonatos')
  const card = page.getByRole('link', { name: new RegExp(`${CHAMPIONSHIP_NAME}.*Abrir campeonato`) })
  await expect(card).toBeVisible()
  await card.click()
  await expect(page).toHaveURL(CHAMPIONSHIP_URL, { timeout: 15_000 })
})

test('creating a championship with a name already used in the category and year shows an error', async ({ page }) => {
  await deleteChampionshipsNamed(CHAMPIONSHIP_NAME)
  await signIn(page, '/campeonatos')
  await page.getByRole('button', { name: 'Novo campeonato SUB-13' }).click()
  await page.getByPlaceholder('ex.: COPA DO VALE').fill(CHAMPIONSHIP_NAME)
  await page.getByRole('button', { name: 'Criar campeonato' }).click()
  await expect(page).toHaveURL(CHAMPIONSHIP_URL, { timeout: 15_000 })

  await page.goto('/campeonatos')
  await page.getByRole('button', { name: 'Novo campeonato SUB-13' }).click()
  await page.getByPlaceholder('ex.: COPA DO VALE').fill(CHAMPIONSHIP_NAME)
  await page.getByRole('button', { name: 'Criar campeonato' }).click()

  await expect(page.getByRole('alert').getByText(/Já existe/)).toBeVisible({ timeout: 15_000 })
})

test('creating a championship without a name warns and stays on the list', async ({ page }) => {
  await signIn(page, '/campeonatos')
  await page.getByRole('button', { name: 'Novo campeonato SUB-13' }).click()

  await page.getByRole('button', { name: 'Criar campeonato' }).click()

  await expect(page.getByRole('alert').getByText('Defina nome e categoria do campeonato')).toBeVisible()
  await expect(page).toHaveURL(/\/campeonatos(\?|$)/)
})
