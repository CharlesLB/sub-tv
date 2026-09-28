import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AddedTimeButton } from './added-time-button'

describe('AddedTimeButton', () => {
  it('renders the added time label with its hint', () => {
    render(<AddedTimeButton onAdd={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Acréscimo' })).toHaveAttribute('title', 'Adicionar 1 minuto de acréscimo')
  })

  it('calls onAdd once when clicked', async () => {
    const onAdd = vi.fn()
    render(<AddedTimeButton onAdd={onAdd} />)

    await userEvent.click(screen.getByRole('button', { name: 'Acréscimo' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})
