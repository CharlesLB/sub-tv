import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CARD_COLOR } from '../../state/live-actions'
import { CardPicker } from './card-picker'

describe('CardPicker', () => {
  it('opens as a modal dialog with the yellow option focused', () => {
    render(<CardPicker onPick={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: 'Escolher cartão' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: 'Amarelo' })).toHaveFocus()
  })

  it('picks the yellow card when the yellow option is clicked', async () => {
    const onPick = vi.fn()
    render(<CardPicker onPick={onPick} onCancel={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Amarelo' }))

    expect(onPick).toHaveBeenCalledWith(CARD_COLOR.YELLOW)
  })

  it('picks the red card when the red option is clicked', async () => {
    const onPick = vi.fn()
    render(<CardPicker onPick={onPick} onCancel={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Vermelho' }))

    expect(onPick).toHaveBeenCalledWith(CARD_COLOR.RED)
  })

  it('cancels without picking when the cancel button is clicked', async () => {
    const onPick = vi.fn()
    const onCancel = vi.fn()
    render(<CardPicker onPick={onPick} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar (esc)' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onPick).not.toHaveBeenCalled()
  })
})
