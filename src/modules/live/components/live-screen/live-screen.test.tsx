import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { recordLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { officialsStripItemsFixture } from '../officials-strip/officials-strip.fixtures'
import { LiveScreen } from './live-screen'
import { liveSnapshotFixture, SilentEventSource } from './live-screen.fixtures'

const COMPACT_QUERY = '(max-width: 619px), (max-height: 479px) and (max-width: 999px)'
const PORTRAIT_PHONE_QUERY = '(max-width: 619px) and (orientation: portrait)'
const SCOREBOARD_AT_KICKOFF = 'União FC 1 × 0 Serra Azul'

class SilentResizeObserver {
  observe = (): void => undefined
  disconnect = (): void => undefined
}

const stubMatchingMediaQuery = (matchingQuery: string | null) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query === matchingQuery, addEventListener: vi.fn(), removeEventListener: vi.fn() }))

const renderScreen = () =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <LiveScreen officialsItems={officialsStripItemsFixture} />
    </LiveMatchProvider>,
  )

describe('LiveScreen', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', SilentEventSource)
    vi.stubGlobal('ResizeObserver', SilentResizeObserver)
    stubMatchingMediaQuery(null)
  })

  it('shows the scoreboard, the officials strip, the events strip and the board', () => {
    renderScreen()

    expect(screen.getByRole('group', { name: SCOREBOARD_AT_KICKOFF })).toBeInTheDocument()
    expect(screen.getByText('Rogério Tavares')).toBeInTheDocument()
    expect(screen.getByText('2 Eventos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).toBeInTheDocument()
  })

  it('swaps the board for the expanded timeline and back when the toggle is clicked', async () => {
    renderScreen()

    await userEvent.click(screen.getByRole('button', { name: 'Expandir a linha do tempo' }))

    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Expandir a linha do tempo' }))

    expect(screen.queryByText('Timeline')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).toBeInTheDocument()
  })

  it('shows the timeline with the rotate notice and no toggle on a portrait phone', () => {
    stubMatchingMediaQuery(PORTRAIT_PHONE_QUERY)

    renderScreen()

    expect(screen.getByText('Gire O celular para A prancheta')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Expandir a linha do tempo' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).not.toBeInTheDocument()
  })

  it('shortens the player names on a compact screen', () => {
    stubMatchingMediaQuery(COMPACT_QUERY)

    renderScreen()

    expect(screen.getByText('Enzo')).toBeInTheDocument()
    expect(screen.queryByText('Enzo Barbosa')).not.toBeInTheDocument()
  })

  it('records a goal for the selected player with the keyboard shortcut', async () => {
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'evento-1' } })
    renderScreen()

    await userEvent.keyboard('g')

    expect(screen.getByRole('group', { name: 'União FC 2 × 0 Serra Azul' })).toBeInTheDocument()
    expect(recordLiveEvent).toHaveBeenCalledWith(expect.objectContaining({ playerId: liveSnapshotFixture.players[0]?.playerId }))
  })

  it('shows the sync failure bar when a recorded event cannot be saved', async () => {
    vi.mocked(recordLiveEvent).mockRejectedValue(new Error('sem conexão'))
    renderScreen()

    await userEvent.keyboard('g')

    expect(await screen.findByRole('status', { name: 'Falha ao salvar lances; reenviando' })).toBeInTheDocument()
  })

  it('hides the sync failure bar while every event is saved', () => {
    renderScreen()

    expect(screen.queryByRole('status', { name: 'Falha ao salvar lances; reenviando' })).not.toBeInTheDocument()
  })
})
