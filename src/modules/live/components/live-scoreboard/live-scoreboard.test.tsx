import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type LiveMatchSnapshot, updateLiveClock } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture, liveSnapshotWithEventsFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { nowAfterKickoffMs } from '../live-chrono/live-chrono.fixtures'
import { LiveScoreboard } from './live-scoreboard'

const renderScoreboard = (snapshot: LiveMatchSnapshot) =>
  render(
    <LiveMatchProvider snapshot={snapshot}>
      <LiveScoreboard />
    </LiveMatchProvider>,
  )

describe('LiveScoreboard', () => {
  beforeEach(() => {
    vi.mocked(updateLiveClock).mockResolvedValue({ ok: true, data: { statusChanged: false } })

    return silenceLiveStream()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a goalless score, the category and the connection before kickoff', () => {
    renderScoreboard(liveSnapshotFixture)

    expect(screen.getByRole('group', { name: 'União FC 0 × 0 Serra Azul' })).toBeInTheDocument()
    expect(screen.getByText('SUB-14')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Conectando')
  })

  it('hides the live pill and the added time button while the clock is stopped', () => {
    renderScoreboard(liveSnapshotFixture)

    expect(screen.queryByText('Ao vivo')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Acréscimo' })).not.toBeInTheDocument()
  })

  it('counts the goals of each side and shows the live controls while the clock runs', () => {
    vi.useFakeTimers({ now: nowAfterKickoffMs, toFake: ['Date'] })
    renderScoreboard(liveSnapshotWithEventsFixture)

    expect(screen.getByRole('group', { name: 'União FC 1 × 0 Serra Azul' })).toBeInTheDocument()
    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Acréscimo' })).toBeInTheDocument()
  })

  it('starts the match when the chrono is clicked', async () => {
    renderScoreboard(liveSnapshotFixture)

    await userEvent.click(screen.getByRole('button', { name: 'Clique para iniciar a partida' }))

    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clique para ir ao intervalo' })).toBeInTheDocument()
  })

  it('adds a minute of added time when the added time button is clicked', async () => {
    vi.useFakeTimers({ now: nowAfterKickoffMs, toFake: ['Date'] })
    renderScoreboard(liveSnapshotWithEventsFixture)

    await userEvent.click(screen.getByRole('button', { name: 'Acréscimo' }))

    expect(screen.getByRole('button', { name: 'Clique para ir ao intervalo' })).toHaveTextContent('12:34 +1')
  })
})
