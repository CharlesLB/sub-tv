import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createUser } from '../../actions/user-admin-actions'
import { CreateUserForm } from './create-user-form'

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText(/^Nome/), 'Marina Couto')
  await userEvent.type(screen.getByLabelText(/^Senha/), 'segredo123')
  await userEvent.type(screen.getByLabelText(/^Confirmação/), 'segredo123')
  await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }))
}

describe('CreateUserForm', () => {
  it('renders the name, password and confirmation fields with the submit button', () => {
    render(<CreateUserForm />)

    expect(screen.getByRole('form', { name: 'Novo usuário' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeRequired()
    expect(screen.getByLabelText('Senha')).toHaveAttribute('minlength', '8')
    expect(screen.getByLabelText('Confirmação')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Criar usuário' })).toBeEnabled()
  })

  it('sends the typed name and passwords to the create user action', async () => {
    vi.mocked(createUser).mockResolvedValue({ ok: true, data: { username: 'Marina Couto' } })
    render(<CreateUserForm />)

    await fillAndSubmit()

    const submittedForm = vi.mocked(createUser).mock.calls[0]?.[1]
    expect(submittedForm?.get('username')).toBe('Marina Couto')
    expect(submittedForm?.get('password')).toBe('segredo123')
    expect(submittedForm?.get('confirmation')).toBe('segredo123')
  })

  it('shows the success message and clears the fields when the user is created', async () => {
    vi.mocked(createUser).mockResolvedValue({ ok: true, data: { username: 'Marina Couto' } })
    render(<CreateUserForm />)

    await fillAndSubmit()

    expect(await screen.findByRole('status')).toHaveTextContent('Usuário “Marina Couto” criado.')
    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })

  it('shows each field error under its field and the general error when validation fails', async () => {
    vi.mocked(createUser).mockResolvedValue({
      ok: false,
      error: 'Confira os campos.',
      fieldErrors: { username: ['Digite o nome do usuário.'], password: ['A senha precisa ter pelo menos 8 caracteres.'], confirmation: ['As senhas não conferem.'] },
    })

    render(<CreateUserForm />)

    await fillAndSubmit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Confira os campos.')
    expect(screen.getByText('Digite o nome do usuário.')).toBeInTheDocument()
    expect(screen.getByText('A senha precisa ter pelo menos 8 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument()
  })
})
