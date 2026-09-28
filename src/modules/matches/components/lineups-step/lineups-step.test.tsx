import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { LineupsStep } from './lineups-step'
import { lineupSidesFixture } from './lineups-step.fixtures'

describe('LineupsStep', () => {
  it('shows one lineup card per side with the squad source line', () => {
    render(<LineupsStep sides={lineupSidesFixture} category={CATEGORY.SUB14} year={2026} onToggle={vi.fn()} />)

    expect(screen.getByRole('region', { name: 'Escalação Estrela do Vale' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Escalação Atlético Serrano' })).toBeInTheDocument()
    expect(screen.getByText('Elenco 2026 · 14 Atletas vinculados ao SUB-14')).toBeInTheDocument()
    expect(screen.getByText('Elenco 2026 · 13 Atletas vinculados ao SUB-14')).toBeInTheDocument()
  })

  it('calls onToggle with the side of the card and the player clicked', async () => {
    const onToggle = vi.fn()
    render(<LineupsStep sides={lineupSidesFixture} category={CATEGORY.SUB14} year={2026} onToggle={onToggle} />)

    await userEvent.click(within(screen.getByRole('region', { name: 'Escalação Atlético Serrano' })).getByRole('checkbox', { name: /Isaque Farias/ }))

    expect(onToggle).toHaveBeenCalledWith('away', 'serrano-13')
  })
})
