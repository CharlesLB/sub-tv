import { expect, type Page, test } from '@playwright/test'
import { findSeasonReadyForNewMatch } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'
import { urlEndingWith } from '../support/url/url'

const NO_SEASON_READY = 'Nenhum campeonato com dois elencos completos no banco.'
const SLOW_PAGE = { timeout: 20_000 }

const stepper = (page: Page) => page.getByRole('navigation', { name: 'Etapas da nova partida' })

const openWizardPage = async (page: Page): Promise<string> => {
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, NO_SEASON_READY)
  await signIn(page, `/campeonatos/${seasonId}/nova-partida`)
  await expect(page.getByLabel('Local')).toBeVisible(SLOW_PAGE)

  return seasonId ?? ''
}

test('new match page opened by URL renders the wizard as a full page with the championship context', async ({ page }) => {
  await openWizardPage(page)

  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveTitle('Nova partida · sub.tv')
  await expect(page.getByRole('navigation', { name: 'Trilha de navegação' }).getByText('Nova partida')).toBeVisible()
  await expect(stepper(page).getByRole('button', { name: /^1 Informações/ })).toHaveAttribute('aria-current', 'step')
  await expect(page.getByText(/Esta partida pertence a .* A categoria não é escolhida aqui/)).toBeVisible()
})

test('new match information step starts with the default time and round and the venue empty', async ({ page }) => {
  await openWizardPage(page)

  await expect(page.getByLabel('Horário')).toHaveValue('10:00')
  await expect(page.getByLabel('Rodada')).toHaveValue(/^\d{1,2}$/)
  await expect(page.getByLabel('Data')).toHaveValue(/^\d{4}-\d{2}-\d{2}$/)
  await expect(page.getByLabel('Local')).toHaveValue('')
})

test('new match cannot continue without a venue and the hint asks to fill every field', async ({ page }) => {
  await openWizardPage(page)
  const continueButton = page.getByRole('button', { name: 'Continuar' })

  await expect(continueButton).toHaveAttribute('aria-disabled', 'true')
  await expect(page.getByText(/PREENCHA TODOS OS CAMPOS/i)).toBeVisible()
  await continueButton.click({ force: true })
  await expect(stepper(page).getByRole('button', { name: /^1 Informações/ })).toHaveAttribute('aria-current', 'step')

  await page.getByLabel('Local').fill('Campo de validação')
  await expect(continueButton).not.toHaveAttribute('aria-disabled', 'true')
})

test('new match rejects a round outside 1 to 99', async ({ page }) => {
  await openWizardPage(page)
  await page.getByLabel('Local').fill('Campo de validação')

  await page.getByLabel('Rodada').fill('0')

  await expect(page.getByRole('button', { name: 'Continuar' })).toHaveAttribute('aria-disabled', 'true')
})

test('new match teams step preselects two different teams and disables the team chosen on the other side', async ({ page }) => {
  await openWizardPage(page)
  await page.getByLabel('Local').fill('Campo de times')
  await page.getByRole('button', { name: 'Continuar' }).click()

  const home = page.getByRole('group', { name: 'Time mandante' })
  const away = page.getByRole('group', { name: 'Time visitante' })
  const homeChoice = home.locator('button[aria-pressed="true"]')
  const awayChoice = away.locator('button[aria-pressed="true"]')
  await expect(homeChoice).toHaveCount(1)
  await expect(awayChoice).toHaveCount(1)
  const homeName = (await homeChoice.innerText()).trim()
  await expect(away.getByRole('button', { name: homeName })).toBeDisabled()
  await expect(page.getByText(/Somente os \d+ times inscritos em/)).toBeVisible()
})

test('new match stepper goes back to a finished step and the back button returns one step', async ({ page }) => {
  await openWizardPage(page)
  await page.getByLabel('Local').fill('Campo do stepper')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(stepper(page).getByRole('button', { name: /^3 Escalações/ })).toHaveAttribute('aria-current', 'step')
  await expect(stepper(page).getByRole('button', { name: /^4 Revisão/ })).toBeDisabled()

  await stepper(page)
    .getByRole('button', { name: /Informações/ })
    .click()

  await expect(page.getByLabel('Local')).toHaveValue('Campo do stepper')

  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Voltar' }).click()
  await expect(stepper(page).getByRole('button', { name: /^1 Informações/ })).toHaveAttribute('aria-current', 'step')
})

test('new match lineup list lets the user uncheck and check starters and caps them at eleven', async ({ page }) => {
  await openWizardPage(page)
  await page.getByLabel('Local').fill('Campo da lista')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()

  const firstLineup = page.getByRole('region', { name: /^Escalação / }).first()
  await expect(firstLineup.getByText('11/11 titulares')).toBeVisible()
  const players = firstLineup.getByRole('checkbox')
  const checkedStates = await players.evaluateAll((inputs) => inputs.map((input) => input instanceof HTMLInputElement && input.checked))
  const benchPlayer = players.nth(checkedStates.indexOf(false))
  const starter = players.nth(checkedStates.indexOf(true))
  await expect(benchPlayer).not.toBeChecked()
  await expect(benchPlayer).toHaveAttribute('aria-disabled', 'true')

  await starter.click()
  await expect(starter).not.toBeChecked()
  await expect(firstLineup.getByText('10/11 titulares')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continuar' })).toHaveAttribute('aria-disabled', 'true')

  await benchPlayer.click()
  await expect(benchPlayer).toBeChecked()
  await expect(firstLineup.getByText('11/11 titulares')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continuar' })).not.toHaveAttribute('aria-disabled', 'true')
})

test('new match summary toggles the confrontation, date, venue and category details', async ({ page }) => {
  await openWizardPage(page)
  await page.getByLabel('Local').fill('Campo do resumo')
  const summaryButton = page.getByRole('button', { name: 'Resumo' })

  await summaryButton.click()

  await expect(summaryButton).toHaveAttribute('aria-expanded', 'true')
  const summary = page.getByRole('region', { name: 'Resumo da partida' })
  await expect(summary).toContainText('Campo do resumo')
  await expect(summary).toContainText('Tempo de jogo')
  await expect(summary).toContainText('Herdada do campeonato — times e elencos são exclusivos dela.')
  await summaryButton.click()
  await expect(summary).toHaveCount(0)
})

test('new match cancel on the first step returns to the championship page', async ({ page }) => {
  const seasonId = await openWizardPage(page)

  await page.getByRole('button', { name: 'Cancelar' }).click()

  await expect(page).toHaveURL(urlEndingWith(`/campeonatos/${seasonId}`), SLOW_PAGE)
})
