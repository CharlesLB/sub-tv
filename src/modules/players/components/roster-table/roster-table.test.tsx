import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { secondSquadPlayerFixture, squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { RosterTable } from './roster-table'

const TEAM_COLOR = '#1f4fa3'
const hrefFor = (playerId: string) => `/elencos?atleta=${playerId}`

describe('RosterTable', () => {
  it('shows the column labels and one row per player with the selected one marked', () => {
    render(
      <RosterTable players={[squadPlayerFixture, secondSquadPlayerFixture]} teamColor={TEAM_COLOR} selectedPlayerId={secondSquadPlayerFixture.id} searchText="" hrefFor={hrefFor} onSelect={vi.fn()} />,
    )

    expect(screen.getByText('Posição')).toBeInTheDocument()
    expect(screen.getByText('Curios.')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { current: true })).toHaveAttribute('href', hrefFor(secondSquadPlayerFixture.id))
  })

  it('says the team has no athlete when the list is empty without a search', () => {
    render(<RosterTable players={[]} teamColor={TEAM_COLOR} selectedPlayerId={null} searchText="  " hrefFor={hrefFor} onSelect={vi.fn()} />)

    expect(screen.getByText('Nenhum atleta vinculado a este time ainda.')).toBeInTheDocument()
  })

  it('quotes the trimmed search when no athlete matches it', () => {
    render(<RosterTable players={[]} teamColor={TEAM_COLOR} selectedPlayerId={null} searchText=" Zeca " hrefFor={hrefFor} onSelect={vi.fn()} />)

    expect(screen.getByText('Nenhum atleta encontrado para “Zeca”.')).toBeInTheDocument()
  })

  it('reports the clicked player', async () => {
    const onSelect = vi.fn()
    render(<RosterTable players={[squadPlayerFixture]} teamColor={TEAM_COLOR} selectedPlayerId={null} searchText="" hrefFor={hrefFor} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('link'))

    expect(onSelect).toHaveBeenCalledWith(squadPlayerFixture.id)
  })
})
