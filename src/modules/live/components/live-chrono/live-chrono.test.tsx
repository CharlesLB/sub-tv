import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runningFirstHalfClockFixture } from '../live-board/live-board.fixtures'
import { LiveChrono } from './live-chrono'
import {
  beforeKickoffClockFixture,
  endedClockFixture,
  endedWithoutRecordedClockFixture,
  halfTimeClockFixture,
  nowAfterKickoffMs,
  pausedFirstHalfClockFixture,
  pausedSecondHalfClockFixture,
  runningSecondHalfClockFixture,
  runningWithAddedTimeClockFixture,
} from './live-chrono.fixtures'

describe('LiveChrono', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('invites to start the match before kickoff', () => {
    render(<LiveChrono clock={beforeKickoffClockFixture} onAdvance={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Clique para iniciar a partida' })

    expect(button).toBeEnabled()
    expect(button).toHaveTextContent('1ºTIniciar')
  })

  it('calls onAdvance when the chrono is clicked', async () => {
    const onAdvance = vi.fn()
    render(<LiveChrono clock={beforeKickoffClockFixture} onAdvance={onAdvance} />)

    await userEvent.click(screen.getByRole('button', { name: 'Clique para iniciar a partida' }))

    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('counts the running first half from its start and ticks every second', () => {
    vi.useFakeTimers({ now: nowAfterKickoffMs })
    render(<LiveChrono clock={runningFirstHalfClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para ir ao intervalo' })).toHaveTextContent('12:34')

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(screen.getByRole('button', { name: 'Clique para ir ao intervalo' })).toHaveTextContent('12:35')
  })

  it('appends the added minutes to the running time', () => {
    vi.useFakeTimers({ now: nowAfterKickoffMs })
    render(<LiveChrono clock={runningWithAddedTimeClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para ir ao intervalo' })).toHaveTextContent('12:34 +2')
  })

  it('offers to finish the match while the second half runs', () => {
    vi.useFakeTimers({ now: nowAfterKickoffMs })
    render(<LiveChrono clock={runningSecondHalfClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para encerrar a partida' })).toHaveTextContent('2ºT17:34')
  })

  it('offers to resume a paused first half', () => {
    render(<LiveChrono clock={pausedFirstHalfClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para retomar o 1º tempo' })).toHaveTextContent('1ºTRetomar')
  })

  it('invites to start the second half at half time', () => {
    render(<LiveChrono clock={halfTimeClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para iniciar o 2º tempo' })).toHaveTextContent('2ºTIniciar')
  })

  it('invites to start a paused second half', () => {
    render(<LiveChrono clock={pausedSecondHalfClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Clique para iniciar o 2º tempo' })).toHaveTextContent('2ºTIniciar')
  })

  it('disables the chrono and shows the final time after the match ended', () => {
    render(<LiveChrono clock={endedClockFixture} onAdvance={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Jogo encerrado' })

    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Fim25:30')
  })

  it('reads as closed when the match ended without a recorded clock', () => {
    render(<LiveChrono clock={endedWithoutRecordedClockFixture} onAdvance={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Jogo encerrado' })).toHaveTextContent('FimEncerrado')
  })
})
