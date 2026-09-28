import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { LineupCard } from './lineup-card'
import { awayTeamFixture, homeTeamFixture, teamWithoutPlayersFixture } from './lineup-card.fixtures'

const SOURCE_LINE = 'Elenco 2026 · 14 Atletas vinculados ao SUB-14'
const INCOMPLETE_STARTER_IDS = awayTeamFixture.defaultStarterIds.slice(0, 9)

describe('LineupCard', () => {
  it('shows the team header, the source line and the complete starter count', () => {
    render(<LineupCard team={homeTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={homeTeamFixture.defaultStarterIds} onToggle={vi.fn()} />)

    expect(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()
    expect(screen.getByText(SOURCE_LINE)).toBeInTheDocument()
    expect(screen.getByText('11/11 titulares')).toBeInTheDocument()
  })

  it('lists every player as a checkbox checked when the player starts', () => {
    render(<LineupCard team={homeTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={homeTeamFixture.defaultStarterIds} onToggle={vi.fn()} />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(14)
    expect(screen.getByRole('checkbox', { name: /Caio Ribeiro/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Otávio Siqueira/ })).not.toBeChecked()
  })

  it('locks the reserves once the lineup is complete', () => {
    render(<LineupCard team={homeTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={homeTeamFixture.defaultStarterIds} onToggle={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: /Otávio Siqueira/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('checkbox', { name: /Caio Ribeiro/ })).toHaveAttribute('aria-disabled', 'false')
  })

  it('leaves the reserves unlocked while the lineup is incomplete', () => {
    render(<LineupCard team={awayTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={INCOMPLETE_STARTER_IDS} onToggle={vi.fn()} />)

    expect(screen.getByText('9/11 titulares')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Isaque Farias/ })).toHaveAttribute('aria-disabled', 'false')
  })

  it('appends a nickname different from the name and shows the position when known', () => {
    render(<LineupCard team={homeTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={[]} onToggle={vi.fn()} />)

    expect(screen.getByText('Matheus Rocha "Teteu"')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Pedro Henrique Alves/ }).textContent).toBe('13Pedro Henrique Alves')
    expect(screen.getByRole('checkbox', { name: /Caio Ribeiro/ })).toHaveTextContent('goleiro')
  })

  it('calls onToggle with the player id even when the player is locked', async () => {
    const onToggle = vi.fn()
    render(<LineupCard team={homeTeamFixture} category={CATEGORY.SUB14} sourceLine={SOURCE_LINE} starterIds={homeTeamFixture.defaultStarterIds} onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('checkbox', { name: /Otávio Siqueira/ }))

    expect(onToggle).toHaveBeenCalledWith('estrela-12')
  })

  it('shows the empty message when the team has no players in the season', () => {
    render(<LineupCard team={teamWithoutPlayersFixture} category={CATEGORY.SUB13} sourceLine={SOURCE_LINE} starterIds={[]} onToggle={vi.fn()} />)

    expect(screen.getByText('Nenhum atleta vinculado a este time na temporada.')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
