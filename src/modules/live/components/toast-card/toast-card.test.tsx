import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastCard, UNDO_WINDOW_MS } from './toast-card'
import { goalToastFixture, infoToastFixture, warningToastFixture } from './toast-card.fixtures'

const NOTICE_DURATION_MS = 3_600

describe('ToastCard', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('splits the message into a title and a description', () => {
    render(<ToastCard toast={goalToastFixture} onUndo={vi.fn()} onDismiss={vi.fn()} />)

    expect(screen.getByText('GOL MARCADO')).toBeInTheDocument()
    expect(screen.getByText('#9 Davi Moreira')).toBeInTheDocument()
  })

  it('shows only the title when the message has no description', () => {
    render(<ToastCard toast={warningToastFixture} onUndo={vi.fn()} onDismiss={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Selecione um jogador na prancheta')
  })

  it('announces a warning as an alert and other tones as a status', () => {
    render(<ToastCard toast={infoToastFixture} onUndo={vi.fn()} onDismiss={vi.fn()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Intervalo')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('offers undo only when the toast carries an undo entry', () => {
    render(<ToastCard toast={warningToastFixture} onUndo={vi.fn()} onDismiss={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Desfazer' })).not.toBeInTheDocument()
  })

  it('calls onUndo with the toast id when undo is clicked', async () => {
    const onUndo = vi.fn()
    render(<ToastCard toast={goalToastFixture} onUndo={onUndo} onDismiss={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Desfazer' }))

    expect(onUndo).toHaveBeenCalledWith(goalToastFixture.id)
  })

  it('calls onDismiss with the toast id when the close button is clicked', async () => {
    const onDismiss = vi.fn()
    render(<ToastCard toast={warningToastFixture} onUndo={vi.fn()} onDismiss={onDismiss} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(onDismiss).toHaveBeenCalledWith(warningToastFixture.id)
  })

  it('dismisses a notice by itself after the notice duration', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<ToastCard toast={warningToastFixture} onUndo={vi.fn()} onDismiss={onDismiss} />)

    act(() => vi.advanceTimersByTime(NOTICE_DURATION_MS - 1))
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))

    expect(onDismiss).toHaveBeenCalledWith(warningToastFixture.id)
  })

  it('keeps an undoable toast open for the whole undo window', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<ToastCard toast={goalToastFixture} onUndo={vi.fn()} onDismiss={onDismiss} />)

    act(() => vi.advanceTimersByTime(UNDO_WINDOW_MS - 1))
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))

    expect(onDismiss).toHaveBeenCalledWith(goalToastFixture.id)
  })
})
