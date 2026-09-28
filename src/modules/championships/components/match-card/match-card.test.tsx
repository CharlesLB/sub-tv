import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { CATEGORY } from '../../categories'
import { MatchCard } from './match-card'
import { finishedMatchFixture, liveMatchFixture, penaltiesMatchFixture, SEASON_ID_FIXTURE, scheduledMatchFixture, undatedMatchFixture } from './match-card.fixtures'

describe('MatchCard', () => {
  it('shows the final score, round, date, venue and a link to watch a finished match', () => {
    render(<MatchCard match={finishedMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('ENCERRADA')).toBeInTheDocument()
    expect(screen.getByText('R3 · Sáb 12 Abr 15:00')).toBeInTheDocument()
    expect(screen.getByText('FINAL')).toBeInTheDocument()
    expect(screen.getByText('Estádio Municipal · Contagem')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver partida' })).toHaveAttribute('href', routes.live(finishedMatchFixture.id))
  })

  it('dims the losing score and highlights the winning score of a finished match', () => {
    render(<MatchCard match={finishedMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('2')).toHaveClass('text-tx')
    expect(screen.getByText('1')).toHaveClass('text-tx2')
  })

  it('shows the penalty shootout result when a finished match was decided on penalties', () => {
    render(<MatchCard match={penaltiesMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('PÊNALTIS 4–3')).toBeInTheDocument()
  })

  it('marks a live broadcast match as in progress and links to the live screen', () => {
    render(<MatchCard match={liveMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('AO VIVO')).toBeInTheDocument()
    expect(screen.getByText('EM ANDAMENTO')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', routes.live(liveMatchFixture.id))
  })

  it('shows empty scores, kickoff time and a narrate link for a scheduled match without venue', () => {
    render(<MatchCard match={scheduledMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('AGENDADA')).toBeInTheDocument()
    expect(screen.getAllByText('–')).toHaveLength(2)
    expect(screen.getByText('10:30')).toBeInTheDocument()
    expect(screen.getByText('Local a definir')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Narrar' })).toHaveAttribute('href', routes.newMatch(SEASON_ID_FIXTURE, scheduledMatchFixture.id))
  })

  it('falls back to placeholders when the match has no round and no kickoff date', () => {
    render(<MatchCard match={undatedMatchFixture} seasonId={SEASON_ID_FIXTURE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('ADIADA')).toBeInTheDocument()
    expect(screen.getByText('R– · Data a definir')).toBeInTheDocument()
    expect(screen.getByText('--:--')).toBeInTheDocument()
  })
})
