import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamCampaign } from './team-campaign'
import { teamSeasonsFixture } from './team-campaign.fixtures'

describe('TeamCampaign', () => {
  it('links every season to the championships of that year', () => {
    render(<TeamCampaign seasons={teamSeasonsFixture} />)

    expect(screen.getAllByRole('link')).toHaveLength(teamSeasonsFixture.length)
    expect(screen.getByRole('link', { name: /2024/ })).toHaveAttribute('href', '/campeonatos?temporada=2024')
  })

  it('shows championships, recent form, record line and points of a season', () => {
    render(<TeamCampaign seasons={teamSeasonsFixture} />)

    const season = within(screen.getByRole('link', { name: /2025/ }))
    expect(season.getByText('Mineiro Sub-14 · Copa Integração')).toBeInTheDocument()
    expect(season.getByText('11V 2E 0D · 36:5')).toBeInTheDocument()
    expect(season.getByText('35 PTS')).toBeInTheDocument()
    expect(season.getAllByText('V')).toHaveLength(4)
  })
})
