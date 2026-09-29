import { expect, test } from '@playwright/test'
import { signIn } from '../support/sign-in/sign-in'

test.skip(({ isMobile }) => isMobile, 'O botão Sair fica oculto no layout de celular.')

test('signing out returns to the login page and protected pages ask to sign in again', async ({ page }) => {
  await signIn(page, '/campeonatos')

  await page.getByRole('button', { name: 'Sair' }).click()

  await expect(page).toHaveURL(/\/entrar$/)
  await page.goto('/registro')
  await expect(page).toHaveURL(/\/entrar\?para=%2Fregistro/)
})

test('signing out hides the editing controls on public pages', async ({ page }) => {
  await signIn(page, '/campeonatos')
  await expect(page.getByRole('button', { name: /Novo campeonato/ }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Sair' }).click()
  await page.waitForURL(/\/entrar$/)
  await page.goto('/campeonatos')

  await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Novo campeonato/ })).toHaveCount(0)
})
