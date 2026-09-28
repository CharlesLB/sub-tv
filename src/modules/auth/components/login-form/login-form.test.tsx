import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { signIn } from '../../actions/auth-actions'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('renders username and password fields with the submit button', () => {
    render(<LoginForm returnTo={undefined} />)

    expect(screen.getByLabelText('Usuário')).toBeRequired()
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
  })

  it('sends the typed credentials and return path to the sign in action', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: true, data: undefined })
    render(<LoginForm returnTo="/usuarios" />)

    await userEvent.type(screen.getByLabelText('Usuário'), 'narrador')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    const submittedForm = vi.mocked(signIn).mock.calls[0]?.[1]
    expect(submittedForm?.get('username')).toBe('narrador')
    expect(submittedForm?.get('returnTo')).toBe('/usuarios')
  })

  it('shows the action error message when the sign in fails', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: false, error: 'Usuário ou senha inválidos.' })
    render(<LoginForm returnTo={undefined} />)

    await userEvent.type(screen.getByLabelText('Usuário'), 'narrador')
    await userEvent.type(screen.getByLabelText('Senha'), 'errada')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário ou senha inválidos.')
  })
})
