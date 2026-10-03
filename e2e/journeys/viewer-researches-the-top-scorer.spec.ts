import { expect, test } from '@playwright/test'
import { urlContaining } from '../support/url/url'

const SLOW_PAGE = { timeout: 20_000 }
const GOALS_COLUMN = 3
const BEST_SEASON_PATTERN = /^(\d+) Gols? em (\d{4}) · (.+)$/

test.skip(({ isMobile }) => isMobile, 'A pesquisa no histórico é testada no layout de desktop.')

test('viewer finds the SUB-14 top scorer in the history and the same goals show on the athlete page and in the championship statistics', async ({ page }) => {
  const scorer = await test.step('filters the history by SUB-14 and reads the top scorer of the period', async () => {
    await page.goto('/historico')
    await page.getByRole('link', { name: 'SUB-14', exact: true }).click()
    await expect(page).toHaveURL(urlContaining('cat=sub14'), SLOW_PAGE)

    const topScorerLink = page.getByTitle('Abrir a ficha do atleta').first()
    await expect(topScorerLink).toBeVisible(SLOW_PAGE)
    const lines = (await topScorerLink.innerText()).split('\n').map((line) => line.trim())

    return { name: lines[1] ?? '', goals: lines[3] ?? '' }
  })

  const bestSeason = await test.step('opens the athlete page with the category kept and the same goal count', async () => {
    await page.getByTitle('Abrir a ficha do atleta').first().click()

    await expect(page).toHaveURL(/\/historico\/atletas\/[0-9a-f-]{36}\?cat=sub14/, SLOW_PAGE)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(scorer.name)
    await expect(page.getByText('Gols', { exact: true }).first().locator('xpath=preceding-sibling::*[1]')).toHaveText(scorer.goals)

    const bestSeasonLine = await page.getByText(BEST_SEASON_PATTERN).innerText()
    const [, goals, year, championship] = BEST_SEASON_PATTERN.exec(bestSeasonLine.trim()) ?? []

    return { goals: goals ?? '', year: year ?? '', championship: championship ?? '' }
  })

  await test.step('opens that championship of the best season and finds the athlete with the same goals in the top scorers', async () => {
    await page.goto(`/campeonatos?temporada=${bestSeason.year}`)

    await page
      .getByRole('link', { name: /Abrir campeonato/ })
      .filter({ hasText: bestSeason.championship })
      .filter({ hasText: 'SUB-14' })
      .first()
      .click()

    await expect(page).toHaveURL(/\/campeonatos\/[0-9a-f-]{36}/, SLOW_PAGE)

    await page.getByRole('navigation', { name: 'Seções do campeonato' }).getByRole('link', { name: 'Estatísticas' }).click()

    const scorerRow = page.getByRole('table', { name: 'Artilharia' }).getByRole('row').filter({ hasText: scorer.name })
    await expect(scorerRow).toBeVisible(SLOW_PAGE)
    await expect(scorerRow.getByRole('cell').nth(GOALS_COLUMN)).toHaveText(bestSeason.goals)
  })

  await test.step('returns to the history overview', async () => {
    await page.goBack()
    await page.goBack()
    await page.goBack()

    await expect(page).toHaveURL(/\/historico\/atletas\//, SLOW_PAGE)
    await page.getByRole('link', { name: 'Voltar ao geral' }).click()

    await expect(page).toHaveURL(/\/historico(\?|$)/, SLOW_PAGE)
    await expect(page.getByRole('heading', { name: 'Estatísticas gerais' })).toBeVisible(SLOW_PAGE)
  })
})
