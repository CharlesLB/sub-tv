import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SIDE } from '@/modules/matches/client'
import { goalItemFixture, timelineFixture } from '../event-chip/event-chip.fixtures'
import { awayTeamFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventsStrip } from './events-strip'

const teamColors = { [SIDE.HOME]: homeTeamFixture.color, [SIDE.AWAY]: awayTeamFixture.color }

class SilentResizeObserver {
  observe() {}
  disconnect() {}
}

const makeOverflowing = (viewport: HTMLElement, scrollBy: () => void) => {
  Object.defineProperty(viewport, 'scrollWidth', { value: 1_000 })
  Object.defineProperty(viewport, 'clientWidth', { value: 200 })
  Object.defineProperty(viewport, 'scrollBy', { value: scrollBy })
  fireEvent.scroll(viewport)
}

describe('EventsStrip', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', SilentResizeObserver)
  })

  it('shows a placeholder and no counter when nothing happened yet', () => {
    render(<EventsStrip items={[]} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={vi.fn()} />)

    expect(screen.getByText('gols, cartões e substituições aparecerão aqui')).toBeInTheDocument()
    expect(screen.queryByText(/^\d+ Eventos?$/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próximos eventos' })).not.toBeInTheDocument()
  })

  it('lists the events newest first with a plural counter', () => {
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={vi.fn()} />)

    const descriptions = screen.getAllByText(/GOL|AMARELO|Intervalo|SUBSTITUIÇÃO/).map((description) => description.textContent)

    expect(descriptions).toEqual(['SUBSTITUIÇÃO — SAI #10 · ENTRA #12', 'Intervalo', 'AMARELO — #9 Otávio', 'GOL — #9 Davi · ASSIST. #10 Heitor'])
    expect(screen.getByText('4 Eventos')).toBeInTheDocument()
    expect(screen.queryByText('gols, cartões e substituições aparecerão aqui')).not.toBeInTheDocument()
  })

  it('animates only the newest event', () => {
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={vi.fn()} />)

    expect(screen.getByText('SUBSTITUIÇÃO — SAI #10 · ENTRA #12').parentElement).toHaveClass('animate-event-in')
    expect(screen.getByText('Intervalo').parentElement).not.toHaveClass('animate-event-in')
  })

  it('uses a singular counter for a single event', () => {
    render(<EventsStrip items={[goalItemFixture]} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={vi.fn()} />)

    expect(screen.getByText('1 Evento')).toBeInTheDocument()
  })

  it('offers to expand the timeline when it is collapsed', async () => {
    const onToggleExpanded = vi.fn()
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={onToggleExpanded} />)
    const toggle = screen.getByRole('button', { name: 'Expandir a linha do tempo' })

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveTextContent('Expandir')
    expect(onToggleExpanded).toHaveBeenCalledTimes(1)
  })

  it('offers to collapse the timeline when it is expanded', () => {
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded canExpand onToggleExpanded={vi.fn()} />)

    const toggle = screen.getByRole('button', { name: 'Expandir a linha do tempo' })

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveTextContent('Recolher')
  })

  it('hides the toggle when the timeline cannot expand', () => {
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded={false} canExpand={false} onToggleExpanded={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Expandir a linha do tempo' })).not.toBeInTheDocument()
  })

  it('shows scroll arrows when the events overflow and scrolls forward on next', async () => {
    const scrollBy = vi.fn()
    render(<EventsStrip items={timelineFixture} teamColors={teamColors} isExpanded={false} canExpand onToggleExpanded={vi.fn()} />)
    const viewport = screen.getByText('Intervalo').parentElement?.parentElement?.parentElement
    if (!viewport) throw new Error('viewport not rendered')

    makeOverflowing(viewport, scrollBy)
    await userEvent.click(screen.getByRole('button', { name: 'Próximos eventos' }))

    expect(screen.getByRole('button', { name: 'Eventos anteriores' })).toBeDisabled()
    expect(scrollBy).toHaveBeenCalledWith({ left: 240, behavior: 'smooth' })
  })
})
