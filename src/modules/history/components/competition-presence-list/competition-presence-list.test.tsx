import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CompetitionPresenceList } from './competition-presence-list'
import { competitionPresencesFixture } from './competition-presence-list.fixtures'

const TEAM_COLOR = '#1f4fa3'

describe('CompetitionPresenceList', () => {
  it('lists each championship with its season count in the team color', () => {
    render(<CompetitionPresenceList presences={competitionPresencesFixture} color={TEAM_COLOR} />)

    expect(screen.getByText('Mineiro Sub-14')).toBeInTheDocument()
    expect(screen.getByText('2 Temporadas')).toHaveStyle({ color: TEAM_COLOR })
  })

  it('uses the singular for a championship played in a single season', () => {
    render(<CompetitionPresenceList presences={competitionPresencesFixture} color={TEAM_COLOR} />)

    expect(screen.getByText('1 Temporada')).toBeInTheDocument()
  })

  it('shows the empty state when the team has no presences', () => {
    render(<CompetitionPresenceList presences={[]} color={TEAM_COLOR} />)

    expect(screen.getByRole('region', { name: 'Presenças por campeonato' })).toHaveTextContent('Nenhuma participação nos filtros selecionados')
  })
})
