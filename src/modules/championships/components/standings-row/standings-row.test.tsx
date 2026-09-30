import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { StandingsRow } from './standings-row'
import { bottomRowFixture, leaderRowFixture, middleRowFixture } from './standings-row.fixtures'

const GROUP_SIZE = 6
const LARGE_GROUP_SIZE = 10

describe('StandingsRow', () => {
  it('shows the team line with points, games, wins, draws, losses and a signed positive goal difference', () => {
    render(<StandingsRow row={leaderRowFixture} index={0} groupSize={GROUP_SIZE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Vale Verde EC')).toBeInTheDocument()
    expect(screen.getByText('13')).toHaveClass('font-extrabold')
    expect(screen.getByText('+8')).toHaveClass('text-ac')
    expect(screen.getAllByTitle(/Vitória|Empate|Derrota/)).toHaveLength(leaderRowFixture.form.length)
  })

  it('highlights a top position in the accent color', () => {
    render(<StandingsRow row={leaderRowFixture} index={0} groupSize={GROUP_SIZE} category={CATEGORY.SUB14} />)

    expect(screen.getAllByText('1')[0]).toHaveClass('text-ac')
  })

  it('marks a bottom position and a negative goal difference in red', () => {
    render(<StandingsRow row={bottomRowFixture} index={5} groupSize={GROUP_SIZE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('6')).toHaveClass('text-vm')
    expect(screen.getByText('-7')).toHaveClass('text-vm')
  })

  it('keeps a middle position of a large group and an even goal difference neutral', () => {
    render(<StandingsRow row={middleRowFixture} index={4} groupSize={LARGE_GROUP_SIZE} category={CATEGORY.SUB14} />)

    expect(screen.getAllByText('5')[0]).toHaveClass('text-tx2')
    expect(screen.getByText('0')).toHaveClass('text-tx4')
  })

  it('lists the squad with shirt numbers, a dash for a missing number and optional positions', () => {
    render(<StandingsRow row={leaderRowFixture} index={0} groupSize={GROUP_SIZE} category={CATEGORY.SUB14} />)

    expect(screen.getByText('3 atletas na súmula')).toBeInTheDocument()
    expect(screen.getByText('Davi Monteiro')).toBeInTheDocument()
    expect(screen.getByText('Meia')).toBeInTheDocument()
    expect(screen.getByText('–')).toHaveStyle({ color: leaderRowFixture.team.color })
  })

  it('opens the squad preview when the team line is clicked', async () => {
    render(<StandingsRow row={leaderRowFixture} index={0} groupSize={GROUP_SIZE} category={CATEGORY.SUB14} />)

    await userEvent.click(screen.getByText('Vale Verde EC'))

    expect(screen.getByText('Vale Verde EC').closest('details')).toHaveAttribute('open')
  })
})
