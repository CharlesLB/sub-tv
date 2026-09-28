import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { setUserActive } from '../../actions/user-admin-actions'
import { activeUserRowFixture, inactiveUserRowFixture } from '../users-table/users-table.fixtures'
import { UserActiveToggle } from './user-active-toggle'

describe('UserActiveToggle', () => {
  it('asks the action to deactivate an active user when clicked', async () => {
    vi.mocked(setUserActive).mockResolvedValue({ ok: true, data: undefined })
    render(<UserActiveToggle userId={activeUserRowFixture.id} isActive isCurrentUser={false} />)

    await userEvent.click(screen.getByRole('button', { name: 'Desativar' }))

    const submittedForm = vi.mocked(setUserActive).mock.calls[0]?.[1]
    expect(submittedForm?.get('userId')).toBe(activeUserRowFixture.id)
    expect(submittedForm?.get('isActive')).toBe('false')
  })

  it('asks the action to activate an inactive user when clicked', async () => {
    vi.mocked(setUserActive).mockResolvedValue({ ok: true, data: undefined })
    render(<UserActiveToggle userId={inactiveUserRowFixture.id} isActive={false} isCurrentUser={false} />)

    await userEvent.click(screen.getByRole('button', { name: 'Ativar' }))

    expect(vi.mocked(setUserActive).mock.calls[0]?.[1].get('isActive')).toBe('true')
  })

  it('locks the deactivate button with an explanation for the signed in user', () => {
    render(<UserActiveToggle userId={activeUserRowFixture.id} isActive isCurrentUser />)

    const button = screen.getByRole('button', { name: 'Desativar' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('title', 'Você não pode desativar o seu próprio usuário')
  })

  it('shows the action error as an alert when the change fails', async () => {
    vi.mocked(setUserActive).mockResolvedValue({ ok: false, error: 'Não foi possível alterar o usuário.' })
    render(<UserActiveToggle userId={activeUserRowFixture.id} isActive isCurrentUser={false} />)

    await userEvent.click(screen.getByRole('button', { name: 'Desativar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível alterar o usuário.')
  })
})
