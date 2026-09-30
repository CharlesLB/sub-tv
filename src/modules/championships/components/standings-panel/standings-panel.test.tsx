import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { StandingsPanel } from './standings-panel'
import { multiplePhasesFixture, singlePhaseFixture } from './standings-panel.fixtures'

describe('StandingsPanel', () => {
  it('shows the empty message and no rounds count when there are no standings yet', () => {
    render(<StandingsPanel phases={[]} category={CATEGORY.SUB14} roundsPlayed={null} />)

    expect(screen.getByText('A classificação aparece quando houver partidas com resultado.')).toBeInTheDocument()
    expect(screen.queryByText(/^Após/)).not.toBeInTheDocument()
  })

  it('counts a single round played in the singular', () => {
    render(<StandingsPanel phases={singlePhaseFixture} category={CATEGORY.SUB14} roundsPlayed={1} />)

    expect(screen.getByText('Após 1 Rodada')).toBeInTheDocument()
  })

  it('counts several rounds played in the plural', () => {
    render(<StandingsPanel phases={singlePhaseFixture} category={CATEGORY.SUB14} roundsPlayed={5} />)

    expect(screen.getByText('Após 5 Rodadas')).toBeInTheDocument()
  })

  it('omits phase titles when the championship has a single phase', () => {
    render(<StandingsPanel phases={singlePhaseFixture} category={CATEGORY.SUB14} roundsPlayed={5} />)

    expect(screen.queryByText(/^Classificação ·/)).not.toBeInTheDocument()
    expect(screen.getByText('Vale Verde EC')).toBeInTheDocument()
  })

  it('titles each phase and names the joint phase when there are several phases', () => {
    render(<StandingsPanel phases={multiplePhasesFixture} category={CATEGORY.SUB13} roundsPlayed={5} />)

    expect(screen.getByText('Classificação · 2ª Fase')).toBeInTheDocument()
    expect(screen.getByText('Classificação conjunta Sub-13 + Sub-14')).toBeInTheDocument()
    expect(screen.getByText('Grupo A')).toBeInTheDocument()
    expect(screen.getByText('Grupo B')).toBeInTheDocument()
  })

  it('explains the column abbreviations and the recent form colors', () => {
    render(<StandingsPanel phases={[]} category={CATEGORY.SUB14} roundsPlayed={null} />)

    expect(screen.getByText('PTS pontos · J jogos · V vitórias · E empates · D derrotas · SG saldo de gols')).toBeInTheDocument()
    expect(screen.getByTitle('Vitória')).toBeInTheDocument()
    expect(screen.getByTitle('Empate')).toBeInTheDocument()
    expect(screen.getByTitle('Derrota')).toBeInTheDocument()
  })
})
