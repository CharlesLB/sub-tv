import { expect, test } from '@playwright/test'
import { type PlayerProfile, readPlayerProfile, restorePlayerProfile } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { openFirstPlayer, playerSheet, SLOW_SERVER_ACTION } from '../support/squads/squads'

const NICKNAME = 'Apelido E2E'
const original: { playerId: string; profile: PlayerProfile | null } = { playerId: '', profile: null }

test.skip(({ isMobile }) => isMobile, 'A ficha do jogador é testada no layout de desktop.')

test.beforeEach(async ({ page }) => {
  await signIn(page, '/elencos')
  original.playerId = await openFirstPlayer(page)
  original.profile = await readPlayerProfile(original.playerId)
})

test.afterEach(async () => {
  if (original.profile) await restorePlayerProfile(original.playerId, original.profile)
})

test('editing the nickname saves it, shows it in the roster and records who changed it', async ({ page }) => {
  const sheet = playerSheet(page)
  const nicknameInput = sheet.getByLabel('Apelido (como o narrador chama)')

  await nicknameInput.fill(NICKNAME)
  await nicknameInput.press('Enter')

  await expect(page.locator('a[aria-current="true"][href*="atleta="]')).toContainText(`"${NICKNAME}"`)
  await expect(sheet.getByText(/^Última alteração: /)).toBeVisible(SLOW_SERVER_ACTION)
  await expect.poll(async () => (await readPlayerProfile(original.playerId))?.displayName).toBe(NICKNAME)
})

test('choosing a position and a preferred foot saves them immediately', async ({ page }) => {
  const sheet = playerSheet(page)
  const position = original.profile?.position === 'meia' ? { label: 'Volante', value: 'volante' } : { label: 'Meia', value: 'meia' }
  const foot = original.profile?.preferredFoot === 'canhoto' ? { label: 'Destro', value: 'destro' } : { label: 'Canhoto', value: 'canhoto' }

  await sheet.getByRole('group', { name: 'Posição' }).getByText(position.label, { exact: true }).click()
  await expect(sheet.getByText('Salvo')).toBeVisible(SLOW_SERVER_ACTION)
  await sheet.getByRole('group', { name: 'Pé preferido' }).getByText(foot.label, { exact: true }).click()
  await expect(sheet.getByText('Salvo')).toBeVisible(SLOW_SERVER_ACTION)

  await expect.poll(async () => await readPlayerProfile(original.playerId)).toMatchObject({ position: position.value, preferredFoot: foot.value })
  await expect(sheet.getByText(position.label.toUpperCase(), { exact: true })).toBeVisible()
})

test('nickname longer than 30 characters is limited by the field', async ({ page }) => {
  const nicknameInput = playerSheet(page).getByLabel('Apelido (como o narrador chama)')

  await expect(nicknameInput).toHaveAttribute('maxlength', '30')
})

test('read-only number and name come from the federation match reports', async ({ page }) => {
  const readOnlyFields = playerSheet(page).locator('label[title="Vem das súmulas da FMF"] input[disabled]')

  await expect(readOnlyFields).toHaveCount(2)
})
