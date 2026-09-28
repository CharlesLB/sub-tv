import { expect, test } from '@playwright/test'
import { E2E_USERNAME, signIn } from './sign-in'

test('anonymous visitor can browse championships but is sent to sign in to create a match', async ({ page }) => {
  await page.goto('/campeonatos')
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.getByRole('link', { name: 'Nova partida' }).click()

  await expect(page).toHaveURL(/\/entrar/)
  await expect(page.getByRole('heading', { name: 'Acesso da equipe' })).toBeVisible()
})

test('wrong password shows an error and keeps the visitor on the sign-in page', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByLabel('Usuário').fill(E2E_USERNAME)
  await page.getByLabel('Senha').fill('senha-errada')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByText('Usuário ou senha incorretos.')).toBeVisible()
})

test('username is accepted regardless of letter case and the signed-in user is shown', async ({ page }) => {
  await signIn(page, '/campeonatos', E2E_USERNAME.toUpperCase())

  await expect(page.getByTitle('Usuário conectado')).toBeVisible()
})

test('championship list opens a championship and switches between its tabs', async ({ page }) => {
  await signIn(page, '/campeonatos')
  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible()

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await expect(page.getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page')

  await page.getByRole('link', { name: 'Estatísticas' }).click()
  await expect(page.getByText('Artilharia', { exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'Partidas' }).click()
  await expect(page.getByRole('link', { name: 'Partidas' })).toHaveAttribute('aria-current', 'page')
})

test('finished match card opens the match on the broadcast page', async ({ page }) => {
  await signIn(page, '/campeonatos')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.getByRole('link', { name: 'Partidas' }).click()

  await page.locator('article', { hasText: 'ENCERRADA' }).first().getByRole('link', { name: 'Ver partida' }).click()

  await expect(page).toHaveURL(/\/ao-vivo\//)
  await expect(page.getByText(/^Encerrada · /)).toBeVisible()
})

test('season panel switches the list to another year', async ({ page }) => {
  await signIn(page, '/campeonatos')

  await page.getByRole('button', { name: 'Todas as temporadas' }).click()
  await page.getByRole('link', { name: /^2017/ }).click()

  await expect(page).toHaveURL(/temporada=2017/)
})
