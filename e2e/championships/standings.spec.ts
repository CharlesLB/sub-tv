import { expect, test } from '@playwright/test'

const SLOW_PAGE = { timeout: 20_000 }

test.beforeEach(async ({ page }) => {
  await page.goto('/campeonatos?temporada=2024')

  await page
    .getByRole('link', { name: /Abrir campeonato/ })
    .first()
    .click()

  await page.waitForURL(/\/campeonatos\/[0-9a-f-]{36}$/, SLOW_PAGE)
})

test('standings table shows the rounds played and the column legend', async ({ page }) => {
  await expect(page.getByText(/Após \d+ Rodadas?/i).first()).toBeVisible(SLOW_PAGE)
  await expect(page.getByText('Clique num time para ver o elenco.').first()).toBeVisible()
  await expect(page.getByText('PTS pontos · J jogos · V vitórias · E empates · D derrotas · SG saldo de gols')).toBeVisible()
})

test('clicking a team in the standings expands its squad from the match reports', async ({ page }) => {
  const firstTeamRow = page.locator('details').first()
  await expect(firstTeamRow).not.toHaveAttribute('open')

  await firstTeamRow.locator('summary').click()

  await expect(firstTeamRow).toHaveAttribute('open')
  await expect(firstTeamRow.getByText(/\d+ atletas na súmula/)).toBeVisible()
})

test('last five results show win, draw and loss squares with their meaning', async ({ page }) => {
  const formSquares = page.locator('[title="Vitória"], [title="Empate"], [title="Derrota"]')

  await expect(formSquares.first()).toBeVisible(SLOW_PAGE)
})
