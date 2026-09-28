import { expect, test } from '@playwright/test'
import { deleteCuriositiesStartingWith } from './database'
import { signIn } from './sign-in'

const CURIOSITY_PREFIX = 'Curiosidade de teste automatizado'

test.afterEach(async () => {
  await deleteCuriositiesStartingWith(CURIOSITY_PREFIX)
})

test('adding and removing a curiosity in Elencos keeps working for the signed-in user', async ({ page }) => {
  const curiosityText = `${CURIOSITY_PREFIX} ${Date.now()}`
  await signIn(page, '/elencos')

  await page.getByPlaceholder('nova curiosidade').fill(curiosityText)
  await page.getByRole('button', { name: 'Adicionar' }).click()
  const addedCuriosity = page.getByRole('listitem').filter({ hasText: curiosityText })
  await expect(addedCuriosity).toBeVisible()

  await addedCuriosity.getByRole('button', { name: /Remover/ }).click()
  await expect(page.getByText(curiosityText)).toHaveCount(0)
})
