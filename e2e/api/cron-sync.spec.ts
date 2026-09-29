import { expect, test } from '@playwright/test'

const CRON_PATH = '/api/cron/fmf-sync'
const REFUSED_STATUSES = [401, 500]

test('nightly sync endpoint refuses a request without the cron secret', async ({ request }) => {
  const response = await request.get(CRON_PATH)

  expect(REFUSED_STATUSES).toContain(response.status())
  const body = await response.json()
  expect(body.error.code).toMatch(/^(unauthorized|cron_not_configured)$/)
})

test('nightly sync endpoint refuses a request with a wrong bearer token', async ({ request }) => {
  const response = await request.get(CRON_PATH, { headers: { authorization: 'Bearer segredo-errado' } })

  expect(REFUSED_STATUSES).toContain(response.status())
  expect(await response.json()).not.toHaveProperty('data')
})
