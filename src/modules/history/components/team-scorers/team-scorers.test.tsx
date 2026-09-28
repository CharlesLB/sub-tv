import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { historyHref } from '../../history-href/history-href'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { TeamScorers } from './team-scorers'
import { teamScorersFixture } from './team-scorers.fixtures'

const filter = loadedHistoryFilterFixture.filter
const TEAM_COLOR = '#1f4fa3'

describe('TeamScorers', () => {
  it('links every scorer to the athlete history keeping the current filter', () => {
    render(<TeamScorers scorers={teamScorersFixture} color={TEAM_COLOR} filter={filter} />)

    expect(screen.getAllByRole('link')).toHaveLength(teamScorersFixture.length)
    expect(screen.getByRole('link', { name: /Mateus Ribeiro/ })).toHaveAttribute('href', historyHref({ kind: 'athlete', playerId: '3e2d1c0b-9a8f-4e7d-8c6b-5a4f3e2d1c0b' }, filter))
  })

  it('shows position, games and goals of each scorer', () => {
    render(<TeamScorers scorers={teamScorersFixture} color={TEAM_COLOR} filter={filter} />)

    const scorer = within(screen.getByRole('link', { name: /Mateus Ribeiro/ }))
    expect(scorer.getByText('02')).toBeInTheDocument()
    expect(scorer.getByText('21J')).toBeInTheDocument()
    expect(scorer.getByText('9')).toBeInTheDocument()
  })

  it('sizes each goal bar relative to the top scorer in the team color', () => {
    const { container } = render(<TeamScorers scorers={teamScorersFixture} color={TEAM_COLOR} filter={filter} />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="width"]')]
    expect(bars.map((bar) => bar.style.width)).toEqual(['100%', '53%', '18%'])
    expect(bars[0]).toHaveStyle({ background: TEAM_COLOR })
  })

  it('sizes the goal bars against the most goals even when the list is not sorted', () => {
    const { container } = render(<TeamScorers scorers={teamScorersFixture.toReversed()} color={TEAM_COLOR} filter={filter} />)

    const bars = [...container.querySelectorAll<HTMLElement>('[style*="width"]')]
    expect(bars.map((bar) => bar.style.width)).toEqual(['18%', '53%', '100%'])
  })

  it('shows the empty state when the team scored no goals', () => {
    render(<TeamScorers scorers={[]} color={TEAM_COLOR} filter={filter} />)

    expect(screen.getByRole('region', { name: 'Artilheiros do time' })).toHaveTextContent('Nenhum gol do time nos filtros selecionados')
  })
})
