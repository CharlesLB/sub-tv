import { expect, test } from '@playwright/test'
import { findScheduledMatchReadyForBroadcast } from '../support/database/database'
import { signIn } from '../support/sign-in/sign-in'

const SLOW_PAGE = { timeout: 20_000 }

test('narrating a scheduled match opens the wizard with its round and teams already filled', async ({ page }) => {
  const scheduled = await findScheduledMatchReadyForBroadcast()
  test.skip(scheduled === null, 'Nenhuma partida agendada com elencos completos no banco.')

  await signIn(page, `/campeonatos/${scheduled?.seasonId}/nova-partida?partida=${scheduled?.matchId}`)

  await expect(page.getByLabel('Rodada')).toHaveValue(String(scheduled?.round ?? 1), SLOW_PAGE)
  await expect(page.getByRole('navigation', { name: 'Etapas da nova partida' }).getByRole('button', { name: /^2 Times/ })).toContainText(/[A-Z]{2,4} × [A-Z]{2,4}/)
})

test('new match wizard ignores a prefill id that is not a scheduled match of the championship', async ({ page }) => {
  const scheduled = await findScheduledMatchReadyForBroadcast()
  test.skip(scheduled === null, 'Nenhuma partida agendada com elencos completos no banco.')

  await signIn(page, `/campeonatos/${scheduled?.seasonId}/nova-partida?partida=00000000-0000-4000-8000-000000000000`)

  await expect(page.getByLabel('Local')).toHaveValue('', SLOW_PAGE)
})
