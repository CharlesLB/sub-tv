import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import { FIRST_PHASE_FIXTURE, finishedMatchFixture, SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { RoundPanel } from './round-panel'
import { crowdedRoundMatchesFixture, seasonMatchesFixture } from './round-panel.fixtures'

const ALL_ROUNDS_LABEL = 'Ver todas as rodadas'

const matchLinkCount = () => screen.getAllByRole('link').filter((link) => link.textContent !== ALL_ROUNDS_LABEL).length

describe('RoundPanel', () => {
  it('shows only the matches of the current round and phase with the season match count', () => {
    render(<RoundPanel seasonId={SEASON_ID_FIXTURE} matches={seasonMatchesFixture} currentRound={3} currentPhase={FIRST_PHASE_FIXTURE} />)

    expect(screen.getByText('Rodada 3')).toBeInTheDocument()
    expect(screen.getByText('5 Partidas No campeonato')).toBeInTheDocument()
    expect(matchLinkCount()).toBe(3)
  })

  it('keeps matches of every phase in the round when the current phase is unknown', () => {
    render(<RoundPanel seasonId={SEASON_ID_FIXTURE} matches={seasonMatchesFixture} currentRound={3} currentPhase={null} />)

    expect(matchLinkCount()).toBe(4)
  })

  it('limits the round to eight match cards', () => {
    render(<RoundPanel seasonId={SEASON_ID_FIXTURE} matches={crowdedRoundMatchesFixture} currentRound={3} currentPhase={FIRST_PHASE_FIXTURE} />)

    expect(matchLinkCount()).toBe(8)
  })

  it('shows the empty state with a create match link when the round has no matches', () => {
    render(<RoundPanel seasonId={SEASON_ID_FIXTURE} matches={[finishedMatchFixture]} currentRound={null} currentPhase={null} />)

    expect(screen.getByText('Rodada')).toBeInTheDocument()
    expect(screen.getByText('1 Partida No campeonato')).toBeInTheDocument()
    expect(screen.getByText('Nenhuma partida nesta rodada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Criar partida' })).toHaveAttribute('href', routes.newMatch(SEASON_ID_FIXTURE))
  })

  it('links to the matches tab to see every round', () => {
    render(<RoundPanel seasonId={SEASON_ID_FIXTURE} matches={[]} currentRound={null} currentPhase={null} />)

    expect(screen.getByRole('link', { name: ALL_ROUNDS_LABEL })).toHaveAttribute('href', routes.championship(SEASON_ID_FIXTURE, CHAMPIONSHIP_TAB.MATCHES))
  })
})
