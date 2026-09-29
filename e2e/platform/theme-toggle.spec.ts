import { expect, test } from '@playwright/test'

const THEME_ATTRIBUTE = 'data-tema'

test('theme toggle switches between light and dark and keeps the choice after a reload', async ({ page }) => {
  await page.goto('/campeonatos')
  const html = page.locator('html')
  await expect(html).toHaveAttribute(THEME_ATTRIBUTE, 'claro')

  await page.getByRole('button', { name: 'Mudar para o modo escuro' }).click()
  await expect(html).toHaveAttribute(THEME_ATTRIBUTE, 'escuro')
  await expect(page.getByRole('button', { name: 'Mudar para o modo claro' })).toBeVisible()

  await page.reload()
  await expect(html).toHaveAttribute(THEME_ATTRIBUTE, 'escuro')

  await page.getByRole('button', { name: 'Mudar para o modo claro' }).click()
  await expect(html).toHaveAttribute(THEME_ATTRIBUTE, 'claro')
})
