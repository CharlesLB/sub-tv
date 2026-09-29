import { expect, test } from '@playwright/test'
import { deleteUserAndAuditRows } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { createUser, createUserForm, SLOW_SERVER_ACTION } from '../support/users/users'

const NEW_USER_NAME = 'Usuária Criada E2E'
const NEW_USER_PASSWORD = 'senha-e2e-segura'

test.beforeEach(async ({ page }) => {
  await deleteUserAndAuditRows(NEW_USER_NAME)
  await signIn(page, '/usuarios')
})

test.afterAll(async () => {
  await deleteUserAndAuditRows(NEW_USER_NAME)
})

test('users page lists the current user as active and marked as you', async ({ page }) => {
  const table = page.getByRole('table', { name: 'Usuários' })
  const ownRow = table.getByRole('row').filter({ hasText: 'você' })

  await expect(ownRow).toContainText('Ativo')
  await expect(ownRow.getByRole('button', { name: 'Desativar' })).toBeDisabled()
})

test('creating a user shows it in the table as active and never signed in, and records it in the audit log', async ({ page }) => {
  const newUserRow = await createUser(page, NEW_USER_NAME, NEW_USER_PASSWORD)

  await expect(newUserRow).toContainText('Ativo')
  await expect(newUserRow).toContainText('Nunca entrou')
  await expect(createUserForm(page).getByLabel('Nome')).toHaveValue('')
  await page.goto('/registro')
  await expect(page.getByRole('row').filter({ hasText: 'Criou usuário' }).first()).toContainText(NEW_USER_NAME)
})

test('creating a user with a name already taken in another letter case is refused', async ({ page }) => {
  await createUser(page, NEW_USER_NAME, NEW_USER_PASSWORD)
  const form = createUserForm(page)

  await form.getByLabel('Nome').fill(NEW_USER_NAME.toUpperCase())
  await form.getByLabel('Senha').fill(NEW_USER_PASSWORD)
  await form.getByLabel('Confirmação').fill(NEW_USER_PASSWORD)
  await form.getByRole('button', { name: 'Criar usuário' }).click()

  await expect(form.getByText('Escolha outro nome.')).toBeVisible(SLOW_SERVER_ACTION)
})

test('creating a user with confirmation different from the password shows the mismatch', async ({ page }) => {
  const form = createUserForm(page)

  await form.getByLabel('Nome').fill(NEW_USER_NAME)
  await form.getByLabel('Senha').fill(NEW_USER_PASSWORD)
  await form.getByLabel('Confirmação').fill(`${NEW_USER_PASSWORD}-outra`)
  await form.getByRole('button', { name: 'Criar usuário' }).click()

  await expect(form.getByText('As senhas não conferem.')).toBeVisible(SLOW_SERVER_ACTION)
  await expect(page.getByRole('row', { name: NEW_USER_NAME, exact: true })).toHaveCount(0)
})

test('password field requires at least eight characters', async ({ page }) => {
  await expect(createUserForm(page).getByLabel('Senha')).toHaveAttribute('minlength', '8')
})
