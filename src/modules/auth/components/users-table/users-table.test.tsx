import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsersTable } from './users-table'
import { activeUserRowFixture, currentUserRowFixture, inactiveUserRowFixture, userRowsFixture } from './users-table.fixtures'

const renderTable = () => render(<UsersTable users={userRowsFixture} currentUserId={currentUserRowFixture.id} />)

describe('UsersTable', () => {
  it('shows the column headers and one row per user', () => {
    renderTable()

    expect(screen.getByRole('table', { name: 'Usuários' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Nome', 'Situação', 'Último acesso', 'Ações'])
    expect(screen.getByRole('row', { name: 'Marina Couto' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: 'Otávio Prado' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: 'Renata Faria' })).toBeInTheDocument()
  })

  it('marks the signed in user and locks their deactivate button', () => {
    renderTable()

    const currentUserRow = within(screen.getByRole('row', { name: currentUserRowFixture.username }))

    expect(currentUserRow.getByText('você')).toBeInTheDocument()
    expect(currentUserRow.getByRole('button', { name: 'Desativar' })).toBeDisabled()
    expect(within(screen.getByRole('row', { name: activeUserRowFixture.username })).queryByText('você')).not.toBeInTheDocument()
  })

  it('shows the status and the formatted last sign in of each user', () => {
    renderTable()

    const currentUserRow = within(screen.getByRole('row', { name: currentUserRowFixture.username }))
    const inactiveUserRow = within(screen.getByRole('row', { name: inactiveUserRowFixture.username }))

    expect(currentUserRow.getByText('Ativo')).toBeInTheDocument()
    expect(currentUserRow.getByText('20/09/2026 10:05')).toBeInTheDocument()
    expect(inactiveUserRow.getByText('Inativo')).toBeInTheDocument()
    expect(inactiveUserRow.getByRole('button', { name: 'Ativar' })).toBeEnabled()
  })

  it('shows that a user never signed in when there is no last sign in', () => {
    renderTable()

    expect(within(screen.getByRole('row', { name: activeUserRowFixture.username })).getByText('Nunca entrou')).toBeInTheDocument()
  })
})
