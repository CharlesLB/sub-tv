import { expect, type Locator, type Page } from '@playwright/test'

export const SLOW_SERVER_ACTION = { timeout: 20_000 }

export const createUserForm = (page: Page): Locator => page.getByRole('form', { name: 'Novo usuário' })

export const createUser = async (page: Page, username: string, password: string): Promise<Locator> => {
  const form = createUserForm(page)
  await form.getByLabel('Nome').fill(username)
  await form.getByLabel('Senha').fill(password)
  await form.getByLabel('Confirmação').fill(password)
  await form.getByRole('button', { name: 'Criar usuário' }).click()
  await expect(page.getByRole('status').filter({ hasText: `Usuário “${username}” criado.` })).toBeVisible(SLOW_SERVER_ACTION)

  return page.getByRole('row', { name: username, exact: true })
}
