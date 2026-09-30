import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getCurrentUser } from '@/modules/auth'
import { FmfSyncButton } from './fmf-sync-button'

const renderButton = async () => render(<Suspense>{await FmfSyncButton()}</Suspense>)

describe('FmfSyncButton', () => {
  it('shows the refresh button to a signed in user', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', username: 'Marina Couto' })

    await renderButton()

    expect(screen.getByRole('button', { name: 'Atualizar dados da FMF' })).toBeInTheDocument()
  })

  it('renders nothing when nobody is signed in', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    await renderButton()

    expect(screen.queryByRole('button', { name: 'Atualizar dados da FMF' })).not.toBeInTheDocument()
  })
})
