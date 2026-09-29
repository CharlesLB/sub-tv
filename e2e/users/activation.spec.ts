import { expect, test } from '@playwright/test'
import { deleteUserAndAuditRows } from '../support/database/database'
import { fillSignInForm, signIn, signInOnNewContext } from '../support/sign-in/sign-in'
import { createUser, SLOW_SERVER_ACTION } from '../support/users/users'

const USER_NAME = 'Usuário Ativação E2E'
const USER_PASSWORD = 'senha-ativacao-e2e'

test.beforeEach(async ({ page }) => {
  await deleteUserAndAuditRows(USER_NAME)
  await signIn(page, '/usuarios')
})

test.afterAll(async () => {
  await deleteUserAndAuditRows(USER_NAME)
})

test('a deactivated user cannot sign in and signs in again after being reactivated', async ({ page, browser }) => {
  const userRow = await createUser(page, USER_NAME, USER_PASSWORD)

  await userRow.getByRole('button', { name: 'Desativar' }).click()
  await expect(userRow).toContainText('Inativo', SLOW_SERVER_ACTION)
  const blockedContext = await browser.newContext()
  const blockedPage = await blockedContext.newPage()
  await blockedPage.goto('/entrar')
  await fillSignInForm(blockedPage, USER_NAME, USER_PASSWORD)
  await expect(blockedPage.getByText('Usuário ou senha incorretos.')).toBeVisible(SLOW_SERVER_ACTION)
  await blockedContext.close()

  await userRow.getByRole('button', { name: 'Ativar' }).click()
  await expect(userRow).toContainText('Ativo', SLOW_SERVER_ACTION)
  const allowedPage = await signInOnNewContext(browser, '/campeonatos', USER_NAME, USER_PASSWORD)
  await expect(allowedPage).toHaveURL(/\/campeonatos$/)
  await allowedPage.context().close()

  await page.goto('/registro?acao=usuario_desativado')
  await expect(page.getByRole('row').filter({ hasText: 'Desativou usuário' }).first()).toContainText(USER_NAME)
})

test('a user who signed in shows the last access date instead of never signed in', async ({ page, browser }) => {
  await createUser(page, USER_NAME, USER_PASSWORD)
  const userPage = await signInOnNewContext(browser, '/campeonatos', USER_NAME, USER_PASSWORD)
  await userPage.context().close()

  await page.reload()

  await expect(page.getByRole('row', { name: USER_NAME, exact: true })).toContainText(/\d{2}\/\d{2}\/\d{4}/)
})
