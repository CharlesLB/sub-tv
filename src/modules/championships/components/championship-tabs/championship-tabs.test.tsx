import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { ChampionshipTabs } from './championship-tabs'

describe('ChampionshipTabs', () => {
  it('links every championship section to its tab route', () => {
    render(<ChampionshipTabs seasonId={SEASON_ID_FIXTURE} activeTab={CHAMPIONSHIP_TAB.STANDINGS} />)

    expect(screen.getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.STANDINGS))
    expect(screen.getByRole('link', { name: 'Estatísticas' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.STATISTICS))
    expect(screen.getByRole('link', { name: 'Partidas' })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.MATCHES))
  })

  it('marks only the active tab as the current page', () => {
    render(<ChampionshipTabs seasonId={SEASON_ID_FIXTURE} activeTab={CHAMPIONSHIP_TAB.MATCHES} />)

    expect(screen.getByRole('link', { name: 'Partidas' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Estatísticas' })).not.toHaveAttribute('aria-current')
  })
})
