import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { TopScorersTable } from './top-scorers-table'
import { topScorerFixture, topScorersFixture } from './top-scorers-table.fixtures'

describe('TopScorersTable', () => {
  it('ranks the scorers with two digit positions and highlights the leader', () => {
    render(<TopScorersTable scorers={topScorersFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('01')).toHaveClass('text-ac')
    expect(screen.getByText('02')).toHaveClass('text-tx4')
  })

  it('shows the scorer name with nickname, shirt number, position, team, goals and games', () => {
    render(<TopScorersTable scorers={topScorersFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Miguel Bastos "Miguelzinho"')).toBeInTheDocument()
    expect(screen.getByText('9')).toHaveStyle({ color: topScorerFixture.team.color })
    expect(screen.getByText('Atacante')).toBeInTheDocument()
    expect(screen.getByText('Vale Verde EC')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('falls back to a dash without nickname or position when the scorer data is missing', () => {
    render(<TopScorersTable scorers={topScorersFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Arthur Lacerda')).toBeInTheDocument()
    expect(screen.getByText('–')).toBeInTheDocument()
  })

  it('shows the empty message when no goal was recorded', () => {
    render(<TopScorersTable scorers={[]} category={CATEGORY.SUB13} />)

    expect(screen.getByText('Nenhum gol registrado nas súmulas deste campeonato.')).toBeInTheDocument()
  })
})
