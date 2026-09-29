import type { Browser, Page } from '@playwright/test'
import { E2E_PASSWORD, E2E_USERNAME } from '../credentials/credentials'

const LOGIN_PATH = '/entrar'
const SIGN_IN_TIMEOUT = { timeout: 20_000 }

export const fillSignInForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByLabel('Usuário').fill(username)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

export const signIn = async (page: Page, path: string, username = E2E_USERNAME, password = E2E_PASSWORD): Promise<void> => {
  await page.goto(`${LOGIN_PATH}?para=${encodeURIComponent(path)}`)
  await fillSignInForm(page, username, password)
  await page.waitForURL((url) => !url.pathname.startsWith(LOGIN_PATH), SIGN_IN_TIMEOUT)
}

export const signInOnNewContext = async (browser: Browser, path: string, username = E2E_USERNAME, password = E2E_PASSWORD): Promise<Page> => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await signIn(page, path, username, password)

  return page
}
