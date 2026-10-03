import { expect, test } from '@playwright/test'
import { deleteCuriositiesStartingWith, deleteUserAndAuditRows } from '../support/database/database'
import { signIn, signInOnNewContext } from '../support/sign-in/sign-in'
import { openFirstPlayer, playerSheet, SLOW_PAGE } from '../support/squads/squads'
import { createUser, SLOW_SERVER_ACTION } from '../support/users/users'

const MEMBER_NAME = 'Membro Jornada E2E'
const MEMBER_PASSWORD = 'senha-jornada-e2e'
const CURIOSITY_PREFIX = 'Curiosidade do membro E2E'

test.skip(({ isMobile }) => isMobile, 'A jornada de acesso é testada no layout de desktop.')

test.beforeAll(async () => {
  await deleteUserAndAuditRows(MEMBER_NAME)
})

test.afterAll(async () => {
  await deleteCuriositiesStartingWith(CURIOSITY_PREFIX)
  await deleteUserAndAuditRows(MEMBER_NAME)
})

test('admin creates a member who edits a player sheet, sees the edit in the audit log and loses access after being deactivated', async ({ page, browser }) => {
  test.setTimeout(120_000)
  const curiosity = `${CURIOSITY_PREFIX} ${Date.now()}`

  const memberRow = await test.step('admin creates the account of the new member', async () => {
    await signIn(page, '/usuarios')

    const row = await createUser(page, MEMBER_NAME, MEMBER_PASSWORD)

    await expect(row).toContainText('Ativo')

    return row
  })

  const memberPage = await test.step('the member signs in and adds a curiosity to a player', async () => {
    const opened = await signInOnNewContext(browser, '/elencos', MEMBER_NAME, MEMBER_PASSWORD)
    await openFirstPlayer(opened)
    const sheet = playerSheet(opened)

    await sheet.getByRole('textbox', { name: 'Nova curiosidade' }).fill(curiosity)
    await sheet.getByRole('button', { name: 'Adicionar' }).click()

    await expect(sheet.getByTitle('Adicionou curiosidade')).toBeVisible(SLOW_SERVER_ACTION)
    await expect(sheet.getByText(`Última alteração: ${MEMBER_NAME}`, { exact: false })).toBeVisible()

    return opened
  })

  await test.step('admin filters the audit log by the member and finds the sign-in and the curiosity', async () => {
    await page.goto('/registro')
    await page.getByRole('combobox', { name: 'Usuário', exact: true }).selectOption({ label: MEMBER_NAME })
    await page.getByRole('button', { name: 'Filtrar' }).click()

    await expect(page).toHaveURL(/usuario=[0-9a-f-]{36}/, SLOW_PAGE)
    const table = page.getByRole('table', { name: 'Registro de alterações' })
    await expect(table.getByRole('row').filter({ hasText: 'Adicionou curiosidade' })).toHaveCount(1, SLOW_PAGE)
    await expect(table.getByRole('row').filter({ hasText: 'Adicionou curiosidade' })).toContainText(MEMBER_NAME)
    await expect(table.getByRole('row').filter({ hasText: 'Entrou no sistema' })).toContainText(MEMBER_NAME)
  })

  await test.step('admin deactivates the member', async () => {
    await page.goto('/usuarios')

    await memberRow.getByRole('button', { name: 'Desativar' }).click()

    await expect(memberRow).toContainText('Inativo', SLOW_SERVER_ACTION)
  })

  await test.step('the member, still with the session open, reads the sheet without editing controls and cannot open the audit log', async () => {
    await memberPage.reload()

    await expect(playerSheet(memberPage).getByRole('heading', { name: 'Ficha do jogador' })).toBeVisible(SLOW_PAGE)
    await expect(playerSheet(memberPage).getByRole('textbox', { name: 'Nova curiosidade' })).toHaveCount(0)
    await expect(playerSheet(memberPage).getByRole('link', { name: 'Entre para editar esta ficha' })).toBeVisible()

    await memberPage.goto('/registro')
    await expect(memberPage).toHaveURL(/\/entrar/, SLOW_PAGE)
    await memberPage.context().close()
  })
})
