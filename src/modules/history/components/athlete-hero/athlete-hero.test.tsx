import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AthleteHero } from './athlete-hero'
import { athleteHistoryFixture, athleteWithCrestFixture, athleteWithoutTeamFixture } from './athlete-hero.fixtures'

const CREST_IMAGE_SELECTOR = 'img'

describe('AthleteHero', () => {
  it('shows the athlete name, nickname, team line and season summary', () => {
    render(<AthleteHero history={athleteHistoryFixture} />)

    expect(screen.getByText('Lucas Andrade')).toBeInTheDocument()
    expect(screen.getByText('“Luquinhas”')).toBeInTheDocument()
    expect(screen.getByText('Cruzeiro · SUB-14')).toBeInTheDocument()
    expect(screen.getByText('2 Temporadas No filtro · 24 Jogos')).toBeInTheDocument()
  })

  it('paints the shirt number with the team color when the athlete has a team', () => {
    render(<AthleteHero history={athleteHistoryFixture} />)

    expect(screen.getByText('10')).toHaveStyle({ color: '#1f4fa3' })
  })

  it('falls back to a dash and hides optional lines when the athlete has no team or number', () => {
    render(<AthleteHero history={athleteWithoutTeamFixture} />)

    expect(screen.getByText('–')).toBeInTheDocument()
    expect(screen.queryByText('Cruzeiro · SUB-14')).not.toBeInTheDocument()
    expect(screen.queryByText('“Luquinhas”')).not.toBeInTheDocument()
  })

  it('shows the club crest next to the team line when the club has one', () => {
    const { container } = render(<AthleteHero history={athleteWithCrestFixture} />)

    expect(screen.getByText('Cruzeiro · SUB-14').parentElement?.querySelector(CREST_IMAGE_SELECTOR)).toBeInTheDocument()
    expect(container.querySelectorAll(CREST_IMAGE_SELECTOR)).toHaveLength(1)
  })

  it('shows no crest when the athlete has no team', () => {
    const { container } = render(<AthleteHero history={athleteWithoutTeamFixture} />)

    expect(container.querySelector(CREST_IMAGE_SELECTOR)).not.toBeInTheDocument()
  })
})
