import { expect, test } from '@playwright/test'
import { E2E_PASSWORD, E2E_USERNAME } from '../support/credentials/credentials'
import { fillSignInForm } from '../support/sign-in/sign-in'
import { urlEndingWith } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }
const CHAMPIONSHIP_URL = /\/campeonatos\/[0-9a-f-]{36}$/
const LIVE_URL = /\/ao-vivo\/([0-9a-f-]{36})$/

test.skip(({ isMobile }) => isMobile, 'A jornada do visitante é testada no layout de desktop.')

test('signed-out visitor reads a past championship from the list to a finished match and signs in to open it', async ({ page }) => {
  const sections = page.getByRole('navigation', { name: 'Seções do campeonato' })

  await test.step('opens a 2024 championship from the list without editing controls', async () => {
    await page.goto('/campeonatos?temporada=2024')
    await expect(page.getByRole('heading', { name: 'Todos os campeonatos' })).toBeVisible(SLOW_PAGE)
    await expect(page.getByRole('button', { name: /Novo campeonato/ })).toHaveCount(0)

    await page
      .getByRole('link', { name: /Abrir campeonato/ })
      .first()
      .click()

    await expect(page).toHaveURL(CHAMPIONSHIP_URL, SLOW_PAGE)
    await expect(page.getByRole('navigation', { name: 'Trilha de navegação' })).toContainText('2024')
    await expect(page.getByRole('link', { name: 'Nova partida' })).toHaveCount(0)
  })

  await test.step('reads the standings and expands a team squad from the match reports', async () => {
    await expect(page.getByText(/Após \d+ Rodadas?/i).first()).toBeVisible(SLOW_PAGE)
    const firstTeam = page.locator('details').first()

    await firstTeam.locator('summary').click()

    await expect(firstTeam.getByText(/\d+ atletas na súmula/)).toBeVisible()
  })

  await test.step('switches to the statistics tab and sees the top scorers', async () => {
    await sections.getByRole('link', { name: 'Estatísticas' }).click()

    await expect(page).toHaveURL(/aba=estatisticas/, SLOW_PAGE)
    await expect(page.getByText('Artilharia', { exact: true })).toBeVisible(SLOW_PAGE)
    await expect(sections.getByRole('link', { name: 'Estatísticas' })).toHaveAttribute('aria-current', 'page')
  })

  const matchId = await test.step('switches to the matches tab and asks to see a finished match', async () => {
    await sections.getByRole('link', { name: 'Partidas' }).click()
    const finishedMatch = page.locator('article', { hasText: 'ENCERRADA' }).first()
    await expect(finishedMatch).toBeVisible(SLOW_PAGE)
    const href = (await finishedMatch.getByRole('link', { name: 'Ver partida' }).getAttribute('href')) ?? ''

    await finishedMatch.getByRole('link', { name: 'Ver partida' }).click()

    await expect(page).toHaveURL(`/entrar?para=${encodeURIComponent(href)}`, SLOW_PAGE)

    return LIVE_URL.exec(href)?.[1] ?? ''
  })

  await test.step('signs in and lands on the finished match', async () => {
    await fillSignInForm(page, E2E_USERNAME, E2E_PASSWORD)

    await expect(page).toHaveURL(urlEndingWith(`/ao-vivo/${matchId}`), SLOW_PAGE)
    await expect(page.getByText(/^Encerrada · /)).toBeVisible(SLOW_PAGE)
  })
})
