import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { recordLiveEvent, revertLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { PLAYER } from '../../state/live-state.fixtures'
import { useLiveCommands } from '../../state/use-live-commands'
import { liveSnapshotFixture, SilentEventSource } from '../live-screen/live-screen.fixtures'
import { ToastStack } from './toast-stack'

function RecordGoalButton() {
  const { recordGoal } = useLiveCommands()

  return (
    <button type="button" onClick={() => recordGoal(PLAYER.HOME_STRIKER)}>
      Marcar gol
    </button>
  )
}

const renderStack = () =>
  render(
    <LiveMatchProvider snapshot={liveSnapshotFixture}>
      <RecordGoalButton />
      <ToastStack />
    </LiveMatchProvider>,
  )

describe('ToastStack', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', SilentEventSource)
    vi.mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'evento-1' } })
    vi.mocked(revertLiveEvent).mockResolvedValue({ ok: true, data: null })
  })

  it('renders nothing while there are no toasts', () => {
    renderStack()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows the toast of a recorded goal', async () => {
    renderStack()

    await userEvent.click(screen.getByRole('button', { name: 'Marcar gol' }))

    expect(screen.getByRole('status')).toHaveTextContent('GOL MARCADO')
    expect(screen.getByText('#9 Davi Moreira')).toBeInTheDocument()
  })

  it('removes the toast when it is closed', async () => {
    renderStack()

    await userEvent.click(screen.getByRole('button', { name: 'Marcar gol' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('removes the toast and reverts the goal when undo is clicked', async () => {
    renderStack()

    await userEvent.click(screen.getByRole('button', { name: 'Marcar gol' }))
    await userEvent.click(screen.getByRole('button', { name: 'Desfazer' }))

    expect(screen.queryByText('GOL MARCADO')).not.toBeInTheDocument()
    expect(revertLiveEvent).toHaveBeenCalled()
  })
})
