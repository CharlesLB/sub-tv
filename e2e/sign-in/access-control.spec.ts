import { expect, test } from '@playwright/test'

const UNKNOWN_MATCH_ID = '00000000-0000-4000-8000-000000000000'
const PROTECTED_PAGES = ['/registro', '/usuarios', `/ao-vivo/${UNKNOWN_MATCH_ID}`, `/campeonatos/${UNKNOWN_MATCH_ID}/nova-partida`]

const PUBLIC_PAGES = [
  { path: '/campeonatos', heading: 'Todos os campeonatos' },
  { path: '/elencos', heading: 'Elencos' },
  { path: '/historico', heading: 'Estatísticas gerais' },
]

PROTECTED_PAGES.map((path) =>
  test(`signed-out visitor opening ${path} is sent to the login page with the return path`, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveURL(`/entrar?para=${encodeURIComponent(path)}`)
    await expect(page.getByRole('heading', { name: 'Acesso da equipe' })).toBeVisible()
  }),
)

PUBLIC_PAGES.map(({ path, heading }) =>
  test(`signed-out visitor opening ${path} reads the page with a link to sign in`, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveURL((url) => url.pathname === path)
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toHaveAttribute('href', '/entrar')
  }),
)

test('signed-out request to the live stream API answers 401 with the error contract', async ({ request }) => {
  const response = await request.get(`/api/partidas/${UNKNOWN_MATCH_ID}/stream`)

  expect(response.status()).toBe(401)
  expect(await response.json()).toEqual({ error: { code: 'unauthorized', message: 'Entre no sistema para continuar.' } })
})

test('root address redirects to the championships list', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/campeonatos$/)
})
