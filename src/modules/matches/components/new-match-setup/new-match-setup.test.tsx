import { render, screen } from '@testing-library/react'
import type * as Navigation from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { requireUser } from '@/modules/auth'
import { getMatchSetup } from '../../data/get-match-setup'
import { matchSetupFixture } from '../new-match-wizard/new-match-wizard.fixtures'
import { NewMatchSetup } from './new-match-setup'

vi.mock('next/navigation', async (importOriginal) => ({ ...(await importOriginal<typeof Navigation>()), useRouter: vi.fn() }))

const SETUP_PROPS = { seasonId: matchSetupFixture.championship.id, prefillMatchId: null, presentation: 'page' } as const

describe('NewMatchSetup', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn(), back: vi.fn(), replace: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), bfcacheId: 'nova-partida' })
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('renders the wizard for the season setup after checking the user', async () => {
    vi.mocked(getMatchSetup).mockResolvedValue(matchSetupFixture)

    render(<Suspense>{await NewMatchSetup(SETUP_PROPS)}</Suspense>)

    expect(requireUser).toHaveBeenCalledOnce()
    expect(getMatchSetup).toHaveBeenCalledWith(matchSetupFixture.championship.id, null)
    expect(screen.getByRole('navigation', { name: 'Etapas da nova partida' })).toBeInTheDocument()
  })

  it('asks for the setup with the match to prefill', async () => {
    vi.mocked(getMatchSetup).mockResolvedValue(matchSetupFixture)

    await NewMatchSetup({ ...SETUP_PROPS, prefillMatchId: 'partida-agendada' })

    expect(getMatchSetup).toHaveBeenCalledWith(matchSetupFixture.championship.id, 'partida-agendada')
  })

  it('throws the not found signal when the season has no setup', async () => {
    vi.mocked(getMatchSetup).mockResolvedValue(null)

    await expect(NewMatchSetup(SETUP_PROPS)).rejects.toThrow()
  })
})
