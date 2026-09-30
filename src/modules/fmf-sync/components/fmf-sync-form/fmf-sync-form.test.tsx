import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { syncFmfData } from '../../actions/fmf-sync-actions'
import { FmfSyncForm } from './fmf-sync-form'

describe('FmfSyncForm', () => {
  it('calls the sync action when the refresh button is clicked', async () => {
    vi.mocked(syncFmfData).mockResolvedValue({ ok: true, data: { matches: 42 } })
    render(<FmfSyncForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Atualizar dados da FMF' }))

    expect(syncFmfData).toHaveBeenCalled()
  })

  it('shows a success notification with the checked matches when the sync finishes', async () => {
    vi.mocked(syncFmfData).mockResolvedValue({ ok: true, data: { matches: 42 } })
    render(<FmfSyncForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Atualizar dados da FMF' }))

    expect(await screen.findByRole('status')).toHaveTextContent('42 partidas conferidas na FMF')
  })

  it('shows the action error as an alert when the sync fails', async () => {
    vi.mocked(syncFmfData).mockResolvedValue({ ok: false, error: 'Não foi possível atualizar os dados da FMF.' })
    render(<FmfSyncForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Atualizar dados da FMF' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível atualizar os dados da FMF.')
  })

  it('hides the notification when it is closed', async () => {
    vi.mocked(syncFmfData).mockResolvedValue({ ok: true, data: { matches: 42 } })
    render(<FmfSyncForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Atualizar dados da FMF' }))

    await userEvent.click(await screen.findByRole('button', { name: 'Fechar notificação' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
