import { expect, test, type Browser, type Page } from '@playwright/test'
import { E2E_USERNAME, signIn } from './sign-in'
import { deleteUserAndAuditRows } from './user-database'

const NEW_USER_NAME = `Usuária E2E ${Date.now()}`
const NEW_USER_PASSWORD = 'senha-e2e-segura'
const LOCALE = 'pt-BR'
const SLOW_SERVER_ACTION = { timeout: 20_000 }

const signInAs = async (browser: Browser, username: string, password: string): Promise<Page> => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('/entrar')
  await page.getByLabel('Usuário').fill(username)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()

  return page
}

test.afterAll(async () => {
  await deleteUserAndAuditRows(NEW_USER_NAME.toLocaleLowerCase(LOCALE))
})

test('audit log shows the sign-in entry of the current user', async ({ page }) => {
  await signIn(page, '/registro')

  await expect(page.getByRole('heading', { name: 'Registro de alterações' })).toBeVisible()
  const signInRow = page.getByRole('row').filter({ hasText: 'Entrou no sistema' }).first()
  await expect(signInRow).toContainText(E2E_USERNAME)
})

test('a created user signs in with any letter case and cannot sign in after being deactivated', async ({ page, browser }) => {
  await signIn(page, '/registro')
  await page.getByRole('link', { name: 'Usuários' }).click()
  await expect(page.getByRole('heading', { name: 'Usuários' })).toBeVisible()

  const createForm = page.getByRole('form', { name: 'Novo usuário' })
  await createForm.getByLabel('Nome').fill(NEW_USER_NAME)
  await createForm.getByLabel('Senha').fill(NEW_USER_PASSWORD)
  await createForm.getByLabel('Confirmação').fill(NEW_USER_PASSWORD)
  await createForm.getByRole('button', { name: 'Criar usuário' }).click()
  const newUserRow = page.getByRole('row', { name: NEW_USER_NAME })
  await expect(newUserRow).toContainText('Ativo', SLOW_SERVER_ACTION)

  const newUserPage = await signInAs(browser, NEW_USER_NAME.toLocaleUpperCase(LOCALE), NEW_USER_PASSWORD)
  await newUserPage.waitForURL((url) => !url.pathname.startsWith('/entrar'), SLOW_SERVER_ACTION)
  await expect(newUserPage.getByTitle('Usuário conectado')).toContainText(NEW_USER_NAME, SLOW_SERVER_ACTION)
  await newUserPage.context().close()

  await newUserRow.getByRole('button', { name: 'Desativar' }).click()
  await expect(newUserRow).toContainText('Inativo', SLOW_SERVER_ACTION)

  const blockedPage = await signInAs(browser, NEW_USER_NAME, NEW_USER_PASSWORD)
  await expect(blockedPage.getByText('Usuário ou senha incorretos.')).toBeVisible(SLOW_SERVER_ACTION)
  await blockedPage.context().close()

  await page.goto('/registro')
  await expect(page.getByRole('row').filter({ hasText: 'Desativou usuário' }).first()).toContainText(NEW_USER_NAME)
})
