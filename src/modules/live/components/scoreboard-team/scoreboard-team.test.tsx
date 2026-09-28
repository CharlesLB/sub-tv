import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreboardTeam } from './scoreboard-team'
import { homeTeamFixture } from './scoreboard-team.fixtures'

describe('ScoreboardTeam', () => {
  it('shows the team abbreviation with the full name as its title', () => {
    render(<ScoreboardTeam team={homeTeamFixture} />)

    expect(screen.getByTitle('União FC')).toHaveTextContent('UNI')
  })

  it('paints the block with the team color', () => {
    render(<ScoreboardTeam team={homeTeamFixture} />)

    expect(screen.getByTitle('União FC')).toHaveStyle({ background: '#C4411B' })
  })
})
