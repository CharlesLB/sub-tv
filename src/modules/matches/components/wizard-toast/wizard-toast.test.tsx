import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WizardToast } from './wizard-toast'

const FAILURE_MESSAGE = 'Não foi possível criar a partida · Tente novamente em instantes.'
const TOAST_DURATION_MS = 3800

describe('WizardToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('splits the message into a title and a description at the separator', () => {
    render(<WizardToast message={FAILURE_MESSAGE} onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível criar a partida')).toBeInTheDocument()
    expect(screen.getByText('Tente novamente em instantes.')).toBeInTheDocument()
  })

  it('shows only the title when the message has no separator', () => {
    render(<WizardToast message="Sem conexão" onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Sem conexão')
    expect(screen.queryByText('Tente novamente em instantes.')).not.toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<WizardToast message={FAILURE_MESSAGE} onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose by itself after the toast duration', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<WizardToast message={FAILURE_MESSAGE} onClose={onClose} />)

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS)
    })

    expect(onClose).toHaveBeenCalledOnce()
  })
})
