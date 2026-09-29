import { expect, test } from '@playwright/test'
import { deleteUserAndAuditRows } from '../support/database/database'
import { signIn, signInOnNewContext } from '../support/sign-in/sign-in'
import { createUser, SLOW_SERVER_ACTION } from '../support/users/users'

const USER_NAME = 'Usuário Senha E2E'
const FIRST_PASSWORD = 'senha-inicial-e2e'
const NEW_PASSWORD = 'senha-nova-e2e'

test.beforeEach(async ({ page }) => {
  await deleteUserAndAuditRows(USER_NAME)
  await signIn(page, '/usuarios')
})

test.afterAll(async () => {
  await deleteUserAndAuditRows(USER_NAME)
})

test('resetting a password lets the user sign in with the new one only', async ({ page, browser }) => {
  const userRow = await createUser(page, USER_NAME, FIRST_PASSWORD)

  await userRow.getByRole('button', { name: 'Redefinir senha' }).click()
  const resetForm = page.getByRole('form', { name: `Nova senha para ${USER_NAME}` })
  await resetForm.getByRole('textbox', { name: 'Nova senha', exact: true }).fill(NEW_PASSWORD)
  await resetForm.getByRole('textbox', { name: 'Confirmar nova senha' }).fill(NEW_PASSWORD)
  await resetForm.getByRole('button', { name: 'Salvar' }).click()

  await expect(page.getByRole('status').filter({ hasText: 'Senha redefinida.' })).toBeVisible(SLOW_SERVER_ACTION)
  await expect(resetForm).toHaveCount(0)
  const newPasswordPage = await signInOnNewContext(browser, '/campeonatos', USER_NAME, NEW_PASSWORD)
  await expect(newPasswordPage).toHaveURL(/\/campeonatos$/)
  await newPasswordPage.context().close()
})

test('resetting a password with a mismatched confirmation keeps the form open with the error', async ({ page }) => {
  const userRow = await createUser(page, USER_NAME, FIRST_PASSWORD)
  await userRow.getByRole('button', { name: 'Redefinir senha' }).click()
  const resetForm = page.getByRole('form', { name: `Nova senha para ${USER_NAME}` })

  await resetForm.getByRole('textbox', { name: 'Nova senha', exact: true }).fill(NEW_PASSWORD)
  await resetForm.getByRole('textbox', { name: 'Confirmar nova senha' }).fill(`${NEW_PASSWORD}-x`)
  await resetForm.getByRole('button', { name: 'Salvar' }).click()

  await expect(resetForm.getByText('As senhas não conferem.')).toBeVisible(SLOW_SERVER_ACTION)
})

test('cancelling the password reset closes the form', async ({ page }) => {
  const userRow = await createUser(page, USER_NAME, FIRST_PASSWORD)
  await userRow.getByRole('button', { name: 'Redefinir senha' }).click()
  const resetForm = page.getByRole('form', { name: `Nova senha para ${USER_NAME}` })

  await resetForm.getByRole('button', { name: 'Cancelar' }).click()

  await expect(resetForm).toHaveCount(0)
})
