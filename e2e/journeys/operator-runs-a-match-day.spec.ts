import { expect, test } from '@playwright/test'
import { E2E_USERNAME } from '../support/credentials/credentials'
import { countActiveEventsOf, deleteMatchAndRestoreBroadcasts, findSeasonReadyForNewMatch, readBroadcastMatchIds, readMatchStatus } from '../support/database/database'
import { findHomePitchDot, NO_SEASON_READY, openActionMenu, pitchDots, STREAM_TIMEOUT, scoreboard } from '../support/live-match/live-match'
import { signIn } from '../support/sign-in/sign-in'

const SLOW_PAGE = { timeout: 20_000 }
const LIVE_URL = /\/ao-vivo\/([0-9a-f-]{36})$/
const VENUE = 'Campo da jornada E2E'
const GOAL_EVENT = 'gol'
const created: { matchId: string; previousBroadcastIds: string[] } = { matchId: '', previousBroadcastIds: [] }

test.skip(({ isMobile }) => isMobile, 'A jornada do dia de jogo é testada no layout de desktop.')

test.afterAll(async () => {
  if (created.matchId) await deleteMatchAndRestoreBroadcasts(created.matchId, created.previousBroadcastIds)
})

test('operator creates a match from the championship, narrates it to the final whistle and finds it in the matches tab and the audit log', async ({ page }) => {
  test.setTimeout(120_000)
  const seasonId = await findSeasonReadyForNewMatch()
  test.skip(seasonId === null, NO_SEASON_READY)
  created.previousBroadcastIds = await readBroadcastMatchIds()

  await test.step('opens the new match sheet from the championship and goes live', async () => {
    await signIn(page, `/campeonatos/${seasonId}`)
    await page.getByRole('link', { name: 'Nova partida' }).first().click()
    const sheet = page.getByRole('dialog', { name: 'Nova partida' })
    await expect(sheet).toBeVisible(SLOW_PAGE)

    await sheet.getByLabel('Local').fill(VENUE)
    await sheet.getByRole('button', { name: 'Continuar' }).click()
    await sheet.getByRole('button', { name: 'Continuar' }).click()
    await expect(sheet.getByRole('navigation', { name: 'Etapas da nova partida' }).getByRole('button', { name: /Escalações 11\/11 E 11\/11/ })).toBeVisible()
    await sheet.getByRole('button', { name: 'Continuar' }).click()
    await sheet.getByRole('button', { name: 'Criar e ir ao vivo' }).click()

    await expect(page).toHaveURL(LIVE_URL, { timeout: 30_000 })
    created.matchId = LIVE_URL.exec(page.url())?.[1] ?? ''
    await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
    await expect(pitchDots(page)).toHaveCount(22)
    await expect(scoreboard(page, 0, 0)).toBeVisible()
  })

  await test.step('plays the first half with a home goal and a yellow card', async () => {
    await page.getByRole('button', { name: 'Clique para iniciar a partida' }).click()
    await expect(page.getByText('1º tempo iniciado')).toBeVisible()

    const goalMenu = await openActionMenu(page, await findHomePitchDot(page))
    await goalMenu.getByRole('menuitem', { name: /^Gol/ }).click()
    await expect(scoreboard(page, 1, 0)).toBeVisible()

    const cardMenu = await openActionMenu(page, pitchDots(page).last())
    await cardMenu.getByRole('menuitem', { name: /^Cartão amarelo/ }).click()
    await expect(page.getByText(/^AMARELO — #\d+/)).toBeVisible()

    await page.getByRole('button', { name: 'Clique para ir ao intervalo' }).click()
    await expect(page.getByText('Intervalo').first()).toBeVisible()
  })

  await test.step('plays the second half and blows the final whistle', async () => {
    await page.getByRole('button', { name: 'Clique para iniciar o 2º tempo' }).click()
    await expect(page.getByText('2º tempo iniciado')).toBeVisible()

    await page.getByRole('button', { name: 'Clique para encerrar a partida' }).click()

    await expect(page.getByRole('button', { name: 'Jogo encerrado' })).toBeDisabled()
    await expect(page.getByText('Sincronizado')).toBeVisible(STREAM_TIMEOUT)
    await expect.poll(() => countActiveEventsOf(created.matchId, GOAL_EVENT)).toBe(1)
  })

  await test.step('finds the finished match with its score in the matches tab of the championship', async () => {
    await page.goto(`/campeonatos/${seasonId}?aba=partidas`)
    const matchCard = page.locator('article', { has: page.locator(`a[href="/ao-vivo/${created.matchId}"]`) })

    await expect(matchCard).toBeVisible(SLOW_PAGE)
    await expect(matchCard).toContainText('ENCERRADA')
    await expect(matchCard).toContainText(VENUE)
    await expect(matchCard).toContainText(/1\s*×\s*0/)
  })

  await test.step('closes the broadcast from the context bar', async () => {
    await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Ao vivo' })).toHaveAttribute('href', `/ao-vivo/${created.matchId}`)

    await page.getByRole('button', { name: 'Fechar transmissão' }).click()

    await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Ao vivo' })).toHaveCount(0)
    await expect.poll(async () => (await readMatchStatus(created.matchId))?.isBroadcast).toBe(false)
  })

  await test.step('sees the broadcast creation and the recorded events signed with the operator name in the audit log', async () => {
    await page.goto('/registro?acao=transmissao_criada')
    await expect(page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').nth(1)).toContainText(E2E_USERNAME, SLOW_PAGE)

    await page.goto('/registro?acao=evento_registrado')
    await expect(page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').nth(1)).toContainText(E2E_USERNAME, SLOW_PAGE)

    await page.goto('/registro?acao=transmissao_encerrada')
    await expect(page.getByRole('table', { name: 'Registro de alterações' }).getByRole('row').nth(1)).toContainText(E2E_USERNAME, SLOW_PAGE)
  })
})
