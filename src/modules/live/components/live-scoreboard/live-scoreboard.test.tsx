import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type LiveMatchSnapshot, recordLiveEvent, updateLiveClock } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { PLAYER } from '../../state/live-state.fixtures'
import { useLiveCommands } from '../../state/use-live-commands'
import { liveSnapshotFixture, liveSnapshotWithEventsFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { nowAfterKickoffMs } from '../live-chrono/live-chrono.fixtures'
import { LiveScoreboard } from './live-scoreboard'

const PULSE_CLASS = 'animate-score-pulse'

const HomeGoalButton = () => {
  const { recordGoal } = useLiveCommands()

  return (
    <button type="button" onClick={() => recordGoal(PLAYER.HOME_STRIKER)}>
      Gol do mandante
    </button>
  )
}

const renderScoreboard = (snapshot: LiveMatchSnapshot) =>
  render(
    <LiveMatchProvider snapshot={snapshot}>
      <LiveScoreboard />
      <HomeGoalButton />
    </LiveMatchProvider>,
  )

describe('LiveScoreboard', () => {
  beforeEach(() => {
    vi.mocked(updateLiveClock).mockResolvedValue({ ok: true, data: { statusChanged: false } })
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })

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

  it('pulses only the score of the side that scored', async () => {
    renderScoreboard(liveSnapshotFixture)
    const scores = screen.getByRole('group', { name: 'União FC 0 × 0 Serra Azul' })

    await userEvent.click(screen.getByRole('button', { name: 'Gol do mandante' }))

    expect(scores).toHaveAccessibleName('União FC 1 × 0 Serra Azul')
    expect(screen.getByText('1')).toHaveClass(PULSE_CLASS)
    expect(screen.getByText('0')).not.toHaveClass(PULSE_CLASS)
  })
})
