import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBoardInteractions } from '../../interaction/use-board-interactions'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture, SilentEventSource } from '../live-screen/live-screen.fixtures'
import { Pitch } from './pitch'

function PitchWithInteractions({ isCompact }: { isCompact: boolean }) {
  return <Pitch interactions={useBoardInteractions()} isCompact={isCompact} />
}

const renderPitch = (isCompact = false) =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <PitchWithInteractions isCompact={isCompact} />
    </LiveMatchProvider>,
  )

describe('Pitch', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', SilentEventSource)
  })

  it('draws a dot only for the players on the pitch', () => {
    renderPitch()

    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Camisa 10 — Enzo Barbosa Lima' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Camisa 12 — Heitor Nunes Prado' })).not.toBeInTheDocument()
  })

  it('places each dot at its lineup position', () => {
    renderPitch()

    expect(screen.getByRole('button', { name: 'Camisa 9 — Theo Assis Carvalho' }).parentElement).toHaveStyle({ left: '56%', top: '50%' })
  })

  it('starts with the home number nine selected', () => {
    renderPitch()

    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Camisa 10 — Enzo Barbosa Lima' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects a player activated from the keyboard', () => {
    renderPitch()

    fireEvent.click(screen.getByRole('button', { name: 'Camisa 10 — Enzo Barbosa Lima' }), { detail: 0 })

    expect(screen.getByRole('button', { name: 'Camisa 10 — Enzo Barbosa Lima' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows the match marks of each player on the dot', () => {
    renderPitch()

    expect(screen.getByTitle('1 gol')).toBeInTheDocument()
    expect(screen.getByTitle('1 assistência')).toBeInTheDocument()
    expect(screen.getByTitle('Cartão amarelo')).toBeInTheDocument()
  })

  it('shortens the names on a compact board', () => {
    renderPitch(true)

    expect(screen.getByText('Enzo')).toBeInTheDocument()
    expect(screen.queryByText('Enzo Barbosa')).not.toBeInTheDocument()
  })
})
