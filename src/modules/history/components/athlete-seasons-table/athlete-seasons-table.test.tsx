import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'
import { AthleteSeasonsTable } from './athlete-seasons-table'

describe('AthleteSeasonsTable', () => {
  it('links every season to the championships of that year', () => {
    render(<AthleteSeasonsTable seasons={athleteHistoryFixture.seasons} />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /2025/ })).toHaveAttribute('href', '/campeonatos?temporada=2025')
    expect(screen.getByRole('link', { name: /2025/ })).toHaveAttribute('title', 'Abrir a temporada 2025')
  })

  it('shows championships, games, goals per game and goals of a season', () => {
    render(<AthleteSeasonsTable seasons={athleteHistoryFixture.seasons} />)

    const season = within(screen.getByRole('link', { name: /2025/ }))
    expect(season.getByText('Mineiro Sub-14')).toBeInTheDocument()
    expect(season.getByText('13J')).toBeInTheDocument()
    expect(season.getByText('0,85')).toBeInTheDocument()
    expect(season.getByText('11')).toBeInTheDocument()
  })

  it('joins several championships of the same season with a dot', () => {
    render(<AthleteSeasonsTable seasons={[{ year: 2025, championships: ['Mineiro Sub-14', 'Copa Integração'], games: 4, goals: 1 }]} />)

    expect(screen.getByText('Mineiro Sub-14 · Copa Integração')).toBeInTheDocument()
  })
})
