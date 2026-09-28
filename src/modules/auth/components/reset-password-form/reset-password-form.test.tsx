import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { resetUserPassword } from '../../actions/user-admin-actions'
import { activeUserRowFixture } from '../users-table/users-table.fixtures'
import { ResetPasswordForm } from './reset-password-form'

const renderForm = () => render(<ResetPasswordForm userId={activeUserRowFixture.id} username={activeUserRowFixture.username} />)

const openAndSubmit = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))
  await userEvent.type(screen.getByLabelText('Nova senha'), 'segredo123')
  await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'segredo123')
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
}

describe('ResetPasswordForm', () => {
  it('shows only the reset button while closed', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Redefinir senha' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Nova senha')).not.toBeInTheDocument()
  })

  it('opens a form named after the user when the reset button is clicked', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))

    expect(screen.getByRole('form', { name: 'Nova senha para Otávio Prado' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nova senha')).toHaveAttribute('minlength', '8')
    expect(screen.getByLabelText('Confirmar nova senha')).toBeRequired()
  })

  it('closes the form without submitting when cancel is clicked', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('button', { name: 'Redefinir senha' })).toBeInTheDocument()
    expect(resetUserPassword).not.toHaveBeenCalled()
  })

  it('sends the user id and the typed passwords to the reset password action', async () => {
    vi.mocked(resetUserPassword).mockResolvedValue({ ok: true, data: undefined })
    renderForm()

    await openAndSubmit()

    const submittedForm = vi.mocked(resetUserPassword).mock.calls[0]?.[1]
    expect(submittedForm?.get('userId')).toBe(activeUserRowFixture.id)
    expect(submittedForm?.get('password')).toBe('segredo123')
    expect(submittedForm?.get('confirmation')).toBe('segredo123')
  })

  it('closes the form and confirms the reset when the action succeeds', async () => {
    vi.mocked(resetUserPassword).mockResolvedValue({ ok: true, data: undefined })
    renderForm()

    await openAndSubmit()

    expect(await screen.findByRole('status')).toHaveTextContent('Senha redefinida.')
    expect(screen.queryByLabelText('Nova senha')).not.toBeInTheDocument()
  })

  it('hides the previous confirmation when the form is opened again after a reset', async () => {
    vi.mocked(resetUserPassword).mockResolvedValue({ ok: true, data: undefined })
    renderForm()
    await openAndSubmit()
    await screen.findByRole('status')

    await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))

    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows the password field error instead of the general error when validation fails', async () => {
    vi.mocked(resetUserPassword).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { confirmation: ['As senhas não conferem.'] } })
    renderForm()

    await openAndSubmit()

    expect(await screen.findByText('As senhas não conferem.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the general error as an alert when the action fails without field errors', async () => {
    vi.mocked(resetUserPassword).mockResolvedValue({ ok: false, error: 'Usuário não encontrado.' })
    renderForm()

    await openAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário não encontrado.')
  })
})
