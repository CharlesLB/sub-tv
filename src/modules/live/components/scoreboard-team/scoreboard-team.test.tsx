import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreboardTeam } from './scoreboard-team'
import { homeTeamFixture, homeTeamWithCrestFixture } from './scoreboard-team.fixtures'

const CREST_IMAGE_SELECTOR = 'img'

describe('ScoreboardTeam', () => {
  it('shows the team abbreviation with the full name as its title', () => {
    render(<ScoreboardTeam team={homeTeamFixture} />)

    expect(screen.getByTitle('União FC')).toHaveTextContent('UNI')
  })

  it('paints the block with the team color', () => {
    render(<ScoreboardTeam team={homeTeamFixture} />)

    expect(screen.getByTitle('União FC')).toHaveStyle({ background: '#C4411B' })
  })

  it('shows the club crest before the abbreviation when the club has one', () => {
    render(<ScoreboardTeam team={homeTeamWithCrestFixture} />)

    expect(screen.getByTitle('União FC').querySelector(CREST_IMAGE_SELECTOR)).toBeInTheDocument()
    expect(screen.getByTitle('União FC')).toHaveTextContent('UNI')
  })

  it('shows only the abbreviation when the club has no crest', () => {
    render(<ScoreboardTeam team={homeTeamFixture} />)

    expect(screen.getByTitle('União FC').querySelector(CREST_IMAGE_SELECTOR)).not.toBeInTheDocument()
  })
})
