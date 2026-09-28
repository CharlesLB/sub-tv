import type { Page } from '@playwright/test'

export const E2E_USERNAME = process.env.E2E_USERNAME ?? ''
export const E2E_PASSWORD = process.env.E2E_PASSWORD ?? ''

export const signIn = async (page: Page, path: string, username = E2E_USERNAME): Promise<void> => {
  await page.goto(`/entrar?para=${encodeURIComponent(path)}`)
  await page.getByLabel('Usuário').fill(username)
  await page.getByLabel('Senha').fill(E2E_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL((url) => !url.pathname.startsWith('/entrar'))
}
