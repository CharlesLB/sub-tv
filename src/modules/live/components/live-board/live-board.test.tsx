import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type LiveMatchSnapshot, recordLiveEvent } from '@/modules/matches/client'
import { LiveBoard } from './live-board'
import { liveSnapshotFixture, officialsItemsFixture, silenceLiveStream } from './live-board.fixtures'

const PORTRAIT_MARKER = 'portrait'

class SilentResizeObserver {
  observe() {}
  disconnect() {}
}

const stubViewport = (isPortraitPhone: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: isPortraitPhone && query.includes(PORTRAIT_MARKER),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }))
}

const renderBoard = (snapshot: LiveMatchSnapshot = liveSnapshotFixture) => render(<LiveBoard snapshot={snapshot} officialsItems={officialsItemsFixture} />)

describe('LiveBoard', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', SilentResizeObserver)
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })
    stubViewport(false)

    return silenceLiveStream()
  })

  it('opens the live screen with scoreboard, officials, events strip and board', () => {
    renderBoard()

    expect(screen.getByRole('group', { name: 'União FC 0 × 0 Serra Azul' })).toBeInTheDocument()
    expect(screen.getByText('Renato Pires')).toBeInTheDocument()
    expect(screen.getByText('gols, cartões e substituições aparecerão aqui')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira' })).toBeInTheDocument()
  })

  it('records a goal for the selected player from the keyboard shortcut', async () => {
    renderBoard()

    await userEvent.keyboard('g')

    expect(screen.getByRole('group', { name: 'União FC 1 × 0 Serra Azul' })).toBeInTheDocument()
    expect(screen.getByText('1 Evento')).toBeInTheDocument()
  })

  it('swaps the board for the expanded timeline when the timeline is expanded', async () => {
    renderBoard()

    await userEvent.click(screen.getByRole('button', { name: 'Expandir a linha do tempo' }))

    expect(screen.getByText('Nada registrado ainda')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Camisa 9 — Davi Moreira' })).not.toBeInTheDocument()
  })

  it('shows the timeline with a rotate notice and no expand toggle on a portrait phone', () => {
    stubViewport(true)
    renderBoard()

    expect(screen.getByText('Gire O celular para A prancheta')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Expandir a linha do tempo' })).not.toBeInTheDocument()
  })
})
