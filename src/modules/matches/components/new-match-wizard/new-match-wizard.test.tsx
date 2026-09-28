import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBroadcastMatch } from '../../actions/match-setup-actions'
import { NewMatchWizard } from './new-match-wizard'
import { matchSetupFixture, prefilledMatchSetupFixture } from './new-match-wizard.fixtures'

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

const router = { push: vi.fn(), back: vi.fn(), replace: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), bfcacheId: 'nova-partida' }
const FAILURE_MESSAGE = 'Não foi possível criar a partida · Tente novamente em instantes.'

const advanceTo = async (buttonName: string) => {
  await userEvent.click(screen.getByRole('button', { name: buttonName }))
}

const walkToReview = async () => {
  await advanceTo('Continuar')
  await advanceTo('Continuar')
  await advanceTo('Continuar')
}

describe('NewMatchWizard', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(router)
    Element.prototype.scrollIntoView = vi.fn()
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts on the information step with the championship notice on the page', () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="page" />)

    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent('Informações')
    expect(screen.getByLabelText('Rodada')).toHaveValue('7')
    expect(screen.getByText(/Esta partida pertence a Mineiro SUB-14/)).toBeInTheDocument()
  })

  it('hides the notices when shown as a sheet', () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="sheet" />)

    expect(screen.queryByText(/Esta partida pertence a Mineiro SUB-14/)).not.toBeInTheDocument()
  })

  it('keeps the information step until the venue is filled', async () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="page" />)

    await advanceTo('Continuar')

    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByLabelText('Local')).toBeInTheDocument()
  })

  it('moves to the teams step once the information is complete', async () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="page" />)

    await userEvent.type(screen.getByLabelText('Local'), 'Arena do Vale')
    await advanceTo('Continuar')

    expect(screen.getByRole('group', { name: 'Time mandante' })).toBeInTheDocument()
    expect(screen.getByText(/Times Sub-13 dos mesmos clubes/)).toBeInTheDocument()
  })

  it('returns to the championship page when cancelling from the page', async () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="page" />)

    await advanceTo('Cancelar')

    expect(router.push).toHaveBeenCalledWith(`/campeonatos/${matchSetupFixture.championship.id}`)
  })

  it('goes back in history when cancelling from the sheet', async () => {
    render(<NewMatchWizard setup={matchSetupFixture} presentation="sheet" />)

    await advanceTo('Cancelar')

    expect(router.back).toHaveBeenCalledOnce()
  })

  it('returns one step with the back button', async () => {
    render(<NewMatchWizard setup={prefilledMatchSetupFixture} presentation="page" />)

    await advanceTo('Continuar')
    await advanceTo('Voltar')

    expect(screen.getByLabelText('Local')).toHaveValue('Arena do Vale · campo 2')
  })

  it('opens the summary with the matchup when the summary is toggled', async () => {
    render(<NewMatchWizard setup={prefilledMatchSetupFixture} presentation="page" />)

    await advanceTo('Resumo')

    expect(screen.getByRole('region', { name: 'Resumo da partida' })).toHaveTextContent('Estrela do Vale11/11')
  })

  it('shows the lineup list and then the review of a prefilled match', async () => {
    render(<NewMatchWizard setup={prefilledMatchSetupFixture} presentation="page" />)

    await advanceTo('Continuar')
    await advanceTo('Continuar')

    expect(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()

    await advanceTo('Continuar')

    expect(screen.getByText(/^Rodada 8 · .+ · 09:30 · Arena do Vale · campo 2$/)).toBeInTheDocument()
  })

  it('creates the match with the prefilled data from the review step', async () => {
    vi.mocked(createBroadcastMatch).mockResolvedValue({ ok: true, data: { matchId: 'nova-partida' } })
    render(<NewMatchWizard setup={prefilledMatchSetupFixture} presentation="page" />)

    await walkToReview()
    await advanceTo('Criar e ir ao vivo')

    expect(createBroadcastMatch).toHaveBeenCalledWith(
      expect.objectContaining({
        seasonId: prefilledMatchSetupFixture.championship.id,
        existingMatchId: prefilledMatchSetupFixture.prefill?.matchId,
        kickoffDate: '2026-10-03',
        kickoffTime: '09:30',
        round: '8',
        venue: 'Arena do Vale · campo 2',
      }),
    )
  })

  it('shows the failure toast when the match cannot be created', async () => {
    vi.mocked(createBroadcastMatch).mockResolvedValue({ ok: false, error: FAILURE_MESSAGE })
    render(<NewMatchWizard setup={prefilledMatchSetupFixture} presentation="page" />)

    await walkToReview()
    await advanceTo('Criar e ir ao vivo')

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível criar a partida')
  })
})
