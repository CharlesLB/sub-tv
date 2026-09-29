import { expect, test } from '@playwright/test'
import { E2E_USERNAME } from '../support/credentials/credentials'
import { signIn } from '../support/sign-in/sign-in'

test('audit log lists the sign-in of the current user with when, who and what', async ({ page }) => {
  await signIn(page, '/registro')

  await expect(page).toHaveTitle('Registro de alterações · sub.tv')
  const table = page.getByRole('table', { name: 'Registro de alterações' })
  const signInRow = table.getByRole('row').filter({ hasText: 'Entrou no sistema' }).first()
  await expect(signInRow).toContainText(E2E_USERNAME)
  await expect(signInRow).toContainText(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)
})

test('audit log header links to the users administration', async ({ page }) => {
  await signIn(page, '/registro')

  await page.getByRole('link', { name: 'Usuários', exact: true }).click()

  await expect(page).toHaveURL(/\/usuarios$/)
  await expect(page.getByRole('heading', { name: 'Usuários', level: 1 })).toBeVisible()
})

test('signed-in user chip opens the audit log', async ({ page, isMobile }) => {
  test.skip(isMobile, 'O usuário conectado fica oculto no celular.')
  await signIn(page, '/campeonatos')

  await page.getByTitle('Usuário conectado · abrir o registro de alterações').click()

  await expect(page).toHaveURL(/\/registro$/)
})
