import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getUsers } from '../../data/get-users'
import { requireUser } from '../../services/current-user'
import { signedInUserFixture } from '../user-chip/user-chip.fixtures'
import { userRowsFixture } from '../users-table/users-table.fixtures'
import { UsersScreen } from './users-screen'

const renderScreen = async () => render(<Suspense>{await UsersScreen()}</Suspense>)

describe('UsersScreen', () => {
  it('shows the new user form above the users table', async () => {
    vi.mocked(requireUser).mockResolvedValue(signedInUserFixture)
    vi.mocked(getUsers).mockResolvedValue(userRowsFixture)

    await renderScreen()

    expect(screen.getByRole('form', { name: 'Novo usuário' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Usuários' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(userRowsFixture.length + 1)
  })

  it('marks the signed in user in the table', async () => {
    vi.mocked(requireUser).mockResolvedValue(signedInUserFixture)
    vi.mocked(getUsers).mockResolvedValue(userRowsFixture)

    await renderScreen()

    expect(screen.getByText('você')).toBeInTheDocument()
  })
})
