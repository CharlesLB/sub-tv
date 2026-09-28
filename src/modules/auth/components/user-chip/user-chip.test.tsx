import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { signOut } from '../../actions/auth-actions'
import { getCurrentUser } from '../../services/current-user'
import { UserChip } from './user-chip'
import { signedInUserFixture } from './user-chip.fixtures'

const renderChip = async () => render(<Suspense>{await UserChip()}</Suspense>)

describe('UserChip', () => {
  it('links to the sign in page when nobody is signed in', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    await renderChip()

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/entrar')
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
  })

  it('shows the signed in username linking to the audit log', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(signedInUserFixture)

    await renderChip()

    expect(screen.getByRole('link', { name: 'Marina Couto' })).toHaveAttribute('href', '/registro')
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('calls the sign out action when the sign out button is clicked', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(signedInUserFixture)
    await renderChip()

    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(signOut).toHaveBeenCalled()
  })
})
