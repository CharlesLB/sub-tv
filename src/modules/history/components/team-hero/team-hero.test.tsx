import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamHero } from './team-hero'
import { teamHistoryFixture, teamWithoutSeasonsFixture } from './team-hero.fixtures'

describe('TeamHero', () => {
  it('shows the team name, category and season summary', () => {
    render(<TeamHero history={teamHistoryFixture} />)

    expect(screen.getByText('Cruzeiro')).toBeInTheDocument()
    expect(screen.getByText('SUB-14')).toBeInTheDocument()
    expect(screen.getByText('2 Temporadas No filtro · 24 Jogos · 81% de aproveitamento')).toBeInTheDocument()
  })

  it('paints the abbreviation badge with the team color', () => {
    render(<TeamHero history={teamHistoryFixture} />)

    expect(screen.getByText('CRU')).toHaveStyle({ background: '#1f4fa3' })
  })

  it('summarizes zero seasons when the team has no games in the filter', () => {
    render(<TeamHero history={teamWithoutSeasonsFixture} />)

    expect(screen.getByText('0 Temporadas No filtro · 0 Jogos · 0% de aproveitamento')).toBeInTheDocument()
  })
})
