import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { signIn } from '../../actions/auth-actions'
import { LoginForm } from './login-form'

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  args: { returnTo: undefined },
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const InvalidCredentials: Story = {
  beforeEach: () => {
    mocked(signIn).mockResolvedValue({ ok: false, error: 'Usuário ou senha inválidos.' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Usuário'), 'narrador')
    await userEvent.type(canvas.getByLabelText('Senha'), 'errada')
    await userEvent.click(canvas.getByRole('button', { name: 'Entrar' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Usuário ou senha inválidos.')
  },
}
