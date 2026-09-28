import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { finishedMatchFixture, liveMatchFixture, SEASON_ID_FIXTURE, scheduledMatchFixture, undatedMatchFixture } from '../match-card/match-card.fixtures'
import { RoundMatchCard } from './round-match-card'

describe('RoundMatchCard', () => {
  it('shows the round of a finished match, both scores and a link to watch it', () => {
    render(<RoundMatchCard match={finishedMatchFixture} seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByText('Encerrada · rodada 3')).toBeInTheDocument()
    expect(screen.getByText('Vale Verde EC')).toHaveClass('text-tx')
    expect(screen.getByText('Serrano FC')).toHaveClass('text-tx2')
    expect(screen.getByText('2')).toHaveClass('text-tx')
    expect(screen.getByText('1')).toHaveClass('text-tx2')
    expect(screen.getByRole('link', { name: 'Ver partida' })).toHaveAttribute('href', routes.live(finishedMatchFixture.id))
  })

  it('labels a live broadcast match and links to the broadcast', () => {
    render(<RoundMatchCard match={liveMatchFixture} seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Abrir transmissão' })).toHaveAttribute('href', routes.live(liveMatchFixture.id))
  })

  it('shows the kickoff date, dash scores and a narrate link for a scheduled match', () => {
    render(<RoundMatchCard match={scheduledMatchFixture} seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByText('SÁB 19 ABR · 10:30')).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'Narrar partida' })).toHaveAttribute('href', routes.newMatch(SEASON_ID_FIXTURE, scheduledMatchFixture.id))
  })

  it('shows a pending date when the match has no kickoff', () => {
    render(<RoundMatchCard match={undatedMatchFixture} seasonId={SEASON_ID_FIXTURE} />)

    expect(screen.getByText('Data a definir')).toBeInTheDocument()
  })
})
