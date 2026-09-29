import { expect, test } from '@playwright/test'
import { signIn } from '../support/sign-in/sign-in'

test('audit log pages through older entries and back', async ({ page }) => {
  await signIn(page, '/registro')
  const pagination = page.getByRole('navigation', { name: 'Paginação' })
  test.skip((await pagination.count()) === 0, 'O registro ainda cabe numa página só.')
  await expect(pagination.getByText('Página 1')).toBeVisible()
  await expect(pagination.getByRole('link', { name: 'Anteriores' })).toHaveAttribute('aria-disabled', 'true')

  await pagination.getByRole('link', { name: 'Mais antigas' }).click()

  await expect(page).toHaveURL(/pagina=2/)
  await expect(pagination.getByText('Página 2')).toBeVisible()
  await pagination.getByRole('link', { name: 'Anteriores' }).click()
  await expect(page).not.toHaveURL(/pagina=/)
})
