import { render, screen } from '@testing-library/react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { routes } from '@/lib/routes'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { ChampionshipTabs } from './championship-tabs'

vi.mock(import('next/navigation'), async (importOriginal) => ({ ...(await importOriginal()), useSearchParams: vi.fn() }))

const arrangeQuery = (search: string) => vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams(search))

describe('ChampionshipTabs', () => {
  it('links every championship section to its tab route', () => {
    arrangeQuery('')

    render(<ChampionshipTabs seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.STANDINGS))
    expect(screen.getByRole('link', { name: 'Estatísticas' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.STATISTICS))
    expect(screen.getByRole('link', { name: 'Partidas' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.MATCHES))
  })

  it('marks the tab of the address as the current page', () => {
    arrangeQuery(`aba=${CHAMPIONSHIP_TAB.MATCHES}`)

    render(<ChampionshipTabs seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByRole('link', { name: 'Partidas' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Estatísticas' })).not.toHaveAttribute('aria-current')
  })

  it('marks the standings tab as current when the address names no known tab', () => {
    arrangeQuery('aba=desconhecida')

    render(<ChampionshipTabs seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page')
  })
})
