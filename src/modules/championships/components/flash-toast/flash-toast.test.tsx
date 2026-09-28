import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FlashToast } from './flash-toast'

const TOAST_DURATION_MS = 3800
const PART_OF_TOAST_DURATION_MS = 2000

describe('FlashToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('splits the message into a title and a description on the separator', () => {
    render(<FlashToast message="Campeonato criado · SUB-13" tone="success" onClose={vi.fn()} />)

    expect(screen.getByText('Campeonato criado')).toBeInTheDocument()
    expect(screen.getByText('SUB-13')).toBeInTheDocument()
  })

  it('announces a success message as a status', () => {
    render(<FlashToast message="Campeonato criado" tone="success" onClose={vi.fn()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Campeonato criado')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('announces a warning message as an alert', () => {
    render(<FlashToast message="Defina nome e categoria do campeonato" tone="warning" onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Defina nome e categoria do campeonato')
  })

  it('closes when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<FlashToast message="Campeonato criado" tone="success" onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes by itself after the toast duration', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<FlashToast message="Campeonato criado" tone="success" onClose={onClose} />)

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps its timer running when the parent rerenders with a new close handler', () => {
    vi.useFakeTimers()
    const firstOnClose = vi.fn()
    const latestOnClose = vi.fn()
    const { rerender } = render(<FlashToast message="Campeonato criado" tone="success" onClose={firstOnClose} />)

    act(() => {
      vi.advanceTimersByTime(PART_OF_TOAST_DURATION_MS)
    })

    rerender(<FlashToast message="Campeonato criado" tone="success" onClose={latestOnClose} />)

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS - PART_OF_TOAST_DURATION_MS)
    })

    expect(latestOnClose).toHaveBeenCalledTimes(1)
    expect(firstOnClose).not.toHaveBeenCalled()
  })
})
