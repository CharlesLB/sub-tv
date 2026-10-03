import { expect, test } from '@playwright/test'
import { E2E_USERNAME } from '../support/credentials/credentials'
import { deleteCuriositiesStartingWith, deleteManualPlayersStartingWith, readPlayerProfile } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { playerSheet, rosterRows, SLOW_PAGE, SLOW_SERVER_ACTION } from '../support/squads/squads'

const PLAYER_PREFIX = 'Atleta Jornada E2E'
const CURIOSITY_PREFIX = 'Curiosidade da jornada E2E'
const NICKNAME = 'Jornadinha'
const UNUSED_SHIRT_NUMBER = '97'

test.skip(({ isMobile }) => isMobile, 'A jornada do elenco é testada no layout de desktop.')

test.afterAll(async () => {
  await deleteCuriositiesStartingWith(CURIOSITY_PREFIX)
  await deleteManualPlayersStartingWith(PLAYER_PREFIX)
})

test('operator registers a player in a SUB-14 squad, completes the sheet and a signed-out visitor reads it', async ({ page }) => {
  test.setTimeout(120_000)
  const playerName = `${PLAYER_PREFIX} ${Date.now()}`
  const curiosity = `${CURIOSITY_PREFIX} ${Date.now()}`
  const sheet = playerSheet(page)

  await test.step('filters the squads by SUB-14 and opens the first team', async () => {
    await signIn(page, '/elencos')
    await page.getByRole('navigation', { name: 'Filtro de categoria' }).getByRole('link', { name: 'SUB-14' }).click()

    await expect(page).toHaveURL(/cat=sub14/, SLOW_PAGE)
    await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)
  })

  const playerUrl = await test.step('registers the new player and lands on their sheet', async () => {
    await page.getByRole('button', { name: /novo jogador SUB-14/ }).click()
    await page.getByLabel('Número').last().fill(UNUSED_SHIRT_NUMBER)
    await page.getByLabel('Nome completo').fill(playerName)
    await page.getByRole('button', { name: 'Cadastrar', exact: true }).click()

    await expect(page).toHaveURL(/atleta=/, SLOW_SERVER_ACTION)
    await expect(rosterRows(page).filter({ hasText: playerName })).toBeVisible(SLOW_SERVER_ACTION)

    return page.url()
  })

  const playerId = new URL(playerUrl).searchParams.get('atleta') ?? ''

  await test.step('gives the player a nickname, a position and a preferred foot', async () => {
    const nicknameInput = sheet.getByLabel('Apelido (como o narrador chama)')
    await nicknameInput.fill(NICKNAME)
    await nicknameInput.press('Enter')
    await expect(page.locator('a[aria-current="true"][href*="atleta="]')).toContainText(`"${NICKNAME}"`, SLOW_SERVER_ACTION)

    await sheet.getByRole('group', { name: 'Posição' }).getByText('Meia', { exact: true }).click()
    await expect(sheet.getByText('Salvo')).toBeVisible(SLOW_SERVER_ACTION)
    await sheet.getByRole('group', { name: 'Pé preferido' }).getByText('Canhoto', { exact: true }).click()

    await expect.poll(() => readPlayerProfile(playerId), SLOW_SERVER_ACTION).toEqual({ displayName: NICKNAME, position: 'meia', preferredFoot: 'canhoto' })
  })

  await test.step('adds a curiosity that the narrator will read', async () => {
    await sheet.getByRole('textbox', { name: 'Nova curiosidade' }).fill(curiosity)
    await sheet.getByRole('button', { name: 'Adicionar' }).click()

    await expect(sheet.getByRole('listitem').filter({ hasText: curiosity })).toBeVisible()
    await expect(sheet.getByTitle('Adicionou curiosidade')).toBeVisible(SLOW_SERVER_ACTION)
  })

  await test.step('finds the player again by the shirt number after a reload', async () => {
    await page.reload()
    await expect(rosterRows(page).first()).toBeVisible(SLOW_PAGE)

    await page.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }).fill(UNUSED_SHIRT_NUMBER)

    await expect(rosterRows(page)).toHaveCount(1)
    await expect(rosterRows(page).first()).toContainText(playerName)
    await expect(playerSheet(page).getByRole('listitem').filter({ hasText: curiosity })).toBeVisible()
  })

  await test.step('sees the registration signed with the operator name in the audit log', async () => {
    await page.goto('/registro?acao=jogador_cadastrado')

    const newestRow = page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').nth(1)
    await expect(newestRow).toContainText(E2E_USERNAME, SLOW_PAGE)
    await expect(newestRow).toContainText('Cadastrou jogador')
  })

  await test.step('signs out and reads the same sheet as a visitor without editing controls', async () => {
    await page.getByRole('button', { name: 'Sair' }).click()
    await page.waitForURL(/\/entrar$/)

    await page.goto(playerUrl)

    await expect(playerSheet(page).getByRole('listitem').filter({ hasText: curiosity })).toBeVisible(SLOW_PAGE)
    await expect(page.locator('a[aria-current="true"][href*="atleta="]')).toContainText(playerName)
    await expect(playerSheet(page).getByLabel('Apelido (como o narrador chama)')).toHaveCount(0)
    await expect(playerSheet(page).getByRole('button', { name: 'Remover curiosidade' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /novo jogador/ })).toHaveCount(0)
  })
})
