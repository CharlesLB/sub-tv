import { expect, test } from '@playwright/test'

const UNKNOWN_UUID = '00000000-0000-4000-8000-000000000000'
const MISSING_PLATFORM_PAGES = [`/campeonatos/${UNKNOWN_UUID}`, '/campeonatos/nao-e-um-id', `/historico/atletas/${UNKNOWN_UUID}`, '/historico/atletas/nao-e-um-id', '/historico/times/nao-e-um-time']

MISSING_PLATFORM_PAGES.map((path) =>
  test(`platform page ${path} that does not exist shows the not-found message with a way back`, async ({ page }) => {
    await page.goto(path)

    await expect(page.getByText('Página não encontrada')).toBeVisible({ timeout: 20_000 })
    await page.getByRole('link', { name: 'Ver campeonatos' }).click()
    await expect(page).toHaveURL(/\/campeonatos$/)
  }),
)

test('unknown address outside the platform shows the root not-found page', async ({ page }) => {
  const response = await page.goto('/endereco-que-nao-existe')

  expect(response?.status()).toBe(404)
  await expect(page.getByText('Página não encontrada')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver campeonatos' })).toHaveAttribute('href', '/campeonatos')
})
