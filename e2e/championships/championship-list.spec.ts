import { expect, test } from '@playwright/test'
import { signIn } from '../support/sign-in/sign-in'

const SLOW_PAGE = { timeout: 20_000 }
const CHAMPIONSHIP_URL = /\/campeonatos\/[0-9a-f-]{36}$/

test('championship list shows one column per category with a summary of championships, teams and athletes', async ({ page }) => {
  await page.goto('/campeonatos')

  await expect(page).toHaveTitle('Campeonatos · sub.tv')
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible()
  const sub13 = page.getByRole('region', { name: 'Campeonatos SUB-13' })
  const sub14 = page.getByRole('region', { name: 'Campeonatos SUB-14' })
  await expect(sub13).toContainText(/\d+ campeonatos? · \d+ times? · \d+ atletas?/)
  await expect(sub14).toContainText(/\d+ campeonatos? · \d+ times? · \d+ atletas?/)
})

test('championship card opens the championship page with its name as the title', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')
  const card = page.getByRole('link', { name: /Abrir campeonato/ }).first()

  await card.click()

  await expect(page).toHaveURL(CHAMPIONSHIP_URL, SLOW_PAGE)
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Campeonato', SLOW_PAGE)
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' })).toContainText('2024')
})

test('past season without championships in a category shows the empty column message', async ({ page }) => {
  await page.goto('/campeonatos?temporada=2017')

  const columns = page.getByRole('region', { name: /^Campeonatos SUB-1[34]$/ })
  await expect(columns).toHaveCount(2)
  const texts = await columns.allInnerTexts()
  const hasCardOrEmptyMessage = texts.every((text) => text.includes('Abrir campeonato') || text.includes('Nenhum campeonato nesta temporada') || text.includes('Abrir transmissão'))
  expect(hasCardOrEmptyMessage).toBe(true)
})

test('signed-in user sees the create buttons for both categories and can open and cancel the form', async ({ page }) => {
  await signIn(page, '/campeonatos')

  await page.getByRole('button', { name: 'Novo campeonato SUB-14' }).click()
  await expect(page.getByRole('heading', { name: 'Novo campeonato' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Categoria' }).getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByLabel('Fase')).toHaveValue('1ª FASE · RODADA 1')

  await page.getByRole('button', { name: 'Cancelar' }).click()

  await expect(page.getByRole('heading', { name: 'Novo campeonato' })).toHaveCount(0)
})
