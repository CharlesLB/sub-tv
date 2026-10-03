import { render, screen, within } from '@testing-library/react'
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

  it('exposes the scorers as a table whose rows pair each athlete with goals and games under their column headers', () => {
    render(<TopScorersTable scorers={topScorersFixture} category={CATEGORY.SUB14} />)

    const table = screen.getByRole('table', { name: 'Artilharia' })

    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent),
    ).toEqual(['#', 'Atleta', 'Time', 'G', 'J'])

    const leaderCells = within(within(table).getAllByRole('row')[1] ?? table).getAllByRole('cell')
    expect(leaderCells.map((cell) => cell.textContent)).toEqual(['01', expect.stringContaining('Miguel Bastos'), 'Vale Verde EC', '8', expect.any(String)])
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
