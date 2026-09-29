import { expect, test } from '@playwright/test'
import { E2E_PASSWORD, E2E_USERNAME } from '../support/credentials/credentials'
import { fillSignInForm, signIn } from '../support/sign-in/sign-in'

const WRONG_CREDENTIALS = 'Usuário ou senha incorretos.'
const SIGNED_IN_USER = 'Usuário conectado · abrir o registro de alterações'

test('login page shows the team access form with username and password fields', async ({ page }) => {
  await page.goto('/entrar')

  await expect(page.getByRole('heading', { name: 'Acesso da equipe' })).toBeVisible()
  await expect(page.getByLabel('Usuário')).toBeFocused()
  await expect(page.getByLabel('Senha')).toHaveAttribute('type', 'password')
  await expect(page).toHaveTitle('Entrar · sub.tv')
})

test('login with valid credentials and no return path lands on the championships list', async ({ page }) => {
  await page.goto('/entrar')

  await fillSignInForm(page, E2E_USERNAME, E2E_PASSWORD)

  await expect(page).toHaveURL(/\/campeonatos$/)
  await expect(page.getByTitle(SIGNED_IN_USER)).toContainText(E2E_USERNAME)
})

test('login with a wrong password shows an error and stays on the login page', async ({ page }) => {
  await page.goto('/entrar')

  await fillSignInForm(page, E2E_USERNAME, 'senha-errada')

  await expect(page.getByRole('alert').getByText(WRONG_CREDENTIALS)).toBeVisible()
  await expect(page).toHaveURL(/\/entrar/)
})

test('login with an unknown username shows the same generic error', async ({ page }) => {
  await page.goto('/entrar')

  await fillSignInForm(page, `ninguem-${Date.now()}`, E2E_PASSWORD)

  await expect(page.getByRole('alert').getByText(WRONG_CREDENTIALS)).toBeVisible()
})

test('login with the username in another letter case and extra spaces still signs in', async ({ page }) => {
  await signIn(page, '/campeonatos', `  ${E2E_USERNAME.toUpperCase()}  `)

  await expect(page.getByTitle(SIGNED_IN_USER)).toContainText(E2E_USERNAME)
})

test('login with a return path goes back to the requested page after signing in', async ({ page }) => {
  await page.goto('/registro')
  await expect(page).toHaveURL(/\/entrar\?para=%2Fregistro/)

  await fillSignInForm(page, E2E_USERNAME, E2E_PASSWORD)

  await expect(page).toHaveURL(/\/registro$/)
  await expect(page.getByRole('heading', { name: 'Registro de alterações' })).toBeVisible()
})

test('login with an external return path ignores it and lands on the championships list', async ({ page }) => {
  await page.goto(`/entrar?para=${encodeURIComponent('//example.com/phishing')}`)

  await fillSignInForm(page, E2E_USERNAME, E2E_PASSWORD)

  await expect(page).toHaveURL(/localhost:\d+\/campeonatos$/)
})
