import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LINEUP_VIEW } from '../../wizard-reducer/wizard-reducer'
import { LineupViewToolbar } from './lineup-view-toolbar'

describe('LineupViewToolbar', () => {
  it('presses the list option and explains the list view when the list is active', () => {
    render(<LineupViewToolbar view={LINEUP_VIEW.LIST} onChange={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Visualização' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Campo' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Marque os 11 titulares de cada elenco.')).toBeInTheDocument()
  })

  it('presses the field option and explains dragging when the field is active', () => {
    render(<LineupViewToolbar view={LINEUP_VIEW.FIELD} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Campo' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Arraste um reserva ao gramado/)).toBeInTheDocument()
  })

  it('calls onChange with the view clicked', async () => {
    const onChange = vi.fn()
    render(<LineupViewToolbar view={LINEUP_VIEW.LIST} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Campo' }))

    expect(onChange).toHaveBeenCalledWith(LINEUP_VIEW.FIELD)
  })
})
