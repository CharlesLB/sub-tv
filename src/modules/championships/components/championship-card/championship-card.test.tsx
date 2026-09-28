import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { liveMatchFixture } from '../match-card/match-card.fixtures'
import { ChampionshipCard } from './championship-card'
import {
  championshipWithNextMatchFixture,
  championshipWithoutResultsFixture,
  championshipWithUndatedRoundFixture,
  finishedChampionshipFixture,
  liveChampionshipFixture,
} from './championship-card.fixtures'

describe('ChampionshipCard', () => {
  it('links to the championship and shows its name, status line, category and podium', () => {
    render(<ChampionshipCard championship={championshipWithNextMatchFixture} index={0} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', routes.championship(championshipWithNextMatchFixture.id))
    expect(screen.getByText('Copa do Vale')).toBeInTheDocument()
    expect(screen.getByText('2025 · 1ª Fase · rodada 3')).toBeInTheDocument()
    expect(screen.getByText('SUB-13')).toBeInTheDocument()
    expect(screen.getByText('Vale Verde EC')).toHaveClass('text-tx')
    expect(screen.getByText('Serrano FC')).toHaveClass('text-tx2')
    expect(screen.getByText('Abrir campeonato')).toBeInTheDocument()
  })

  it('shows the next match date and round when a match is scheduled', () => {
    render(<ChampionshipCard championship={championshipWithNextMatchFixture} index={0} />)

    expect(screen.getByText('PRÓXIMA: SÁB 19 ABR · 10:30')).toBeInTheDocument()
    expect(screen.getByText('R4')).toBeInTheDocument()
  })

  it('omits the round when the next match has none', () => {
    render(<ChampionshipCard championship={championshipWithUndatedRoundFixture} index={0} />)

    expect(screen.queryByText(/^R\d/)).not.toBeInTheDocument()
  })

  it('shows the live score and links to the broadcast when a match is live', () => {
    render(<ChampionshipCard championship={liveChampionshipFixture} index={0} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', routes.live(liveMatchFixture.id))
    expect(screen.getByText('UNR 0 × 1 ACE')).toBeInTheDocument()
    expect(screen.getByText('AO VIVO')).toBeInTheDocument()
    expect(screen.getByText('Abrir transmissão')).toBeInTheDocument()
  })

  it('tells that a finished championship is over', () => {
    render(<ChampionshipCard championship={finishedChampionshipFixture} index={0} />)

    expect(screen.getByText('Campeonato encerrado')).toBeInTheDocument()
  })

  it('shows the empty podium and no scheduled match when nothing was played yet', () => {
    render(<ChampionshipCard championship={championshipWithoutResultsFixture} index={0} />)

    expect(screen.getByText('Sem partidas com resultado')).toBeInTheDocument()
    expect(screen.getByText('Sem partida agendada')).toBeInTheDocument()
  })

  it('delays the entrance animation by the card position', () => {
    render(<ChampionshipCard championship={championshipWithNextMatchFixture} index={2} />)

    expect(screen.getByRole('link')).toHaveStyle({ animationDelay: '90ms' })
  })
})
