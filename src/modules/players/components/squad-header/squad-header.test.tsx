import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SquadHeader } from './squad-header'
import { teamSquadFixture } from './squad-header.fixtures'

describe('SquadHeader', () => {
  it('shows the team name, category and squad summary', () => {
    render(<SquadHeader squad={teamSquadFixture} searchText="" canEdit={false} onSearchChange={vi.fn()} onPlayerCreated={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Estrela do Vale' })).toBeInTheDocument()
    expect(screen.getByText('Elenco Estrela do Vale SUB-14 · temporada 2025 · 3 Atletas vinculados')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /novo jogador/ })).not.toBeInTheDocument()
  })

  it('shows the new player trigger when the visitor can edit', () => {
    render(<SquadHeader squad={teamSquadFixture} searchText="" canEdit onSearchChange={vi.fn()} onPlayerCreated={vi.fn()} />)

    expect(screen.getByRole('button', { name: /novo jogador SUB-14/ })).toBeInTheDocument()
  })

  it('reports every change of the search text', async () => {
    const onSearchChange = vi.fn()
    render(<SquadHeader squad={teamSquadFixture} searchText="" canEdit={false} onSearchChange={onSearchChange} onPlayerCreated={vi.fn()} />)

    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }), '7')

    expect(onSearchChange).toHaveBeenCalledWith('7')
  })
})
