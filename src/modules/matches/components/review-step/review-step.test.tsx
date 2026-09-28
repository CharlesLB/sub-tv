import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { lineupSidesFixture } from '../lineups-step/lineups-step.fixtures'
import { ReviewStep } from './review-step'

const SUBTITLE = 'Rodada 7 · 03/10/2026 · 10:00 · Arena do Vale · campo 2'

describe('ReviewStep', () => {
  it('shows the matchup title, the subtitle and the ready badge', () => {
    render(<ReviewStep championshipName="Mineiro" category={CATEGORY.SUB14} subtitle={SUBTITLE} sides={lineupSidesFixture} />)

    expect(screen.getByText('Estrela do Vale × Atlético Serrano')).toBeInTheDocument()
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument()
    expect(screen.getByText('Pronta para transmitir')).toBeInTheDocument()
  })

  it('lists only the starters of each side', () => {
    render(<ReviewStep championshipName="Mineiro" category={CATEGORY.SUB14} subtitle={SUBTITLE} sides={lineupSidesFixture} />)

    expect(screen.getByText('Caio Ribeiro')).toBeInTheDocument()
    expect(screen.queryByText('Otávio Siqueira')).not.toBeInTheDocument()
    expect(screen.getByText('Daniel Aguiar')).toBeInTheDocument()
    expect(screen.queryByText('Felipe Moura')).not.toBeInTheDocument()
  })

  it('shows the broadcast facts with the championship and the match duration', () => {
    render(<ReviewStep championshipName="Mineiro" category={CATEGORY.SUB14} subtitle={SUBTITLE} sides={lineupSidesFixture} />)

    expect(screen.getByText('Campeonato')).toBeInTheDocument()
    expect(screen.getByText('Mineiro · SUB-14')).toBeInTheDocument()
    expect(screen.getByText('Tempo de jogo')).toBeInTheDocument()
    expect(screen.getByText('2 × 30 min')).toBeInTheDocument()
  })
})
