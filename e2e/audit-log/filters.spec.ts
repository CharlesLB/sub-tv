import { expect, test } from '@playwright/test'
import { E2E_USERNAME } from '../support/credentials/credentials'
import { signIn } from '../support/sign-in/sign-in'
import { urlContaining } from '../support/url/url'

test.beforeEach(async ({ page }) => {
  await signIn(page, '/registro')
})

test('filtering by action keeps only entries of that action and writes it to the URL', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Ação', exact: true }).selectOption({ label: 'Entrou no sistema' })
  await page.getByRole('combobox', { name: 'Período', exact: true }).selectOption({ label: 'Últimas 24 horas' })

  await page.getByRole('button', { name: 'Filtrar' }).click()

  await expect(page).toHaveURL(/acao=entrou/)
  await expect(page).toHaveURL(/periodo=hoje/)

  const rows = page
    .getByRole('table', { name: 'Registro de alterações' })
    .getByRole('row')
    .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })

  await expect(rows.first()).toBeVisible()
  const texts = await rows.allInnerTexts()
  expect(texts.every((text) => text.includes('Entrou no sistema'))).toBe(true)
  await expect(page.getByRole('combobox', { name: 'Ação', exact: true })).toHaveValue('entrou')
})

test('filtering by the current user keeps only their entries', async ({ page }) => {
  const userSelect = page.getByRole('combobox', { name: 'Usuário', exact: true })
  const ownOption = userSelect.locator('option', { hasText: E2E_USERNAME })
  const ownUserId = (await ownOption.getAttribute('value')) ?? ''

  await userSelect.selectOption(ownUserId)
  await page.getByRole('button', { name: 'Filtrar' }).click()

  await expect(page).toHaveURL(urlContaining(`usuario=${ownUserId}`))
  await expect(page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').filter({ hasText: 'Entrou no sistema' }).first()).toBeVisible()
})

test('filters that match nothing show the empty message and the clear link lists everything again', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Ação', exact: true }).selectOption({ label: 'Entrou no sistema' })
  await page.getByRole('combobox', { name: 'Entidade', exact: true }).selectOption({ label: 'Campeonato' })
  await page.getByRole('button', { name: 'Filtrar' }).click()
  await expect(page.getByText('Nenhuma alteração encontrada para os filtros selecionados')).toBeVisible()

  await page.getByRole('link', { name: 'Limpar' }).click()

  await expect(page).toHaveURL(/\/registro$/)
  await expect(page.getByText('Nenhuma alteração encontrada para os filtros selecionados')).toHaveCount(0)
  await expect(page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').filter({ hasText: 'Entrou no sistema' }).first()).toBeVisible()
})

test('the clear link also resets the filter fields to their defaults', async ({ page }) => {
  test.fail(true, 'Bug conhecido: os selects usam defaultValue e não são remontados quando Limpar navega para /registro.')
  await page.getByRole('combobox', { name: 'Ação', exact: true }).selectOption({ label: 'Entrou no sistema' })
  await page.getByRole('button', { name: 'Filtrar' }).click()
  await expect(page).toHaveURL(/acao=entrou/)

  await page.getByRole('link', { name: 'Limpar' }).click()

  await expect(page).toHaveURL(/\/registro$/)
  await expect(page.getByRole('combobox', { name: 'Ação', exact: true })).toHaveValue('', { timeout: 3_000 })
})
