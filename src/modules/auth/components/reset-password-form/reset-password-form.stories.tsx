import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { resetUserPassword } from '../../actions/user-admin-actions'
import { activeUserRowFixture } from '../users-table/users-table.fixtures'
import { ResetPasswordForm } from './reset-password-form'

const openAndSubmit = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole('button', { name: 'Redefinir senha' }))
  await userEvent.type(canvas.getByLabelText('Nova senha'), 'segredo123')
  await userEvent.type(canvas.getByLabelText('Confirmar nova senha'), 'segredo123')
  await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }))
}

const meta = {
  title: 'Auth/ResetPasswordForm',
  component: ResetPasswordForm,
  args: { userId: activeUserRowFixture.id, username: activeUserRowFixture.username },
} satisfies Meta<typeof ResetPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Redefinir senha' }))
    await expect(canvas.getByRole('form', { name: 'Nova senha para Otávio Prado' })).toBeInTheDocument()
  },
}

export const PasswordReset: Story = {
  beforeEach: () => {
    mocked(resetUserPassword).mockResolvedValue({ ok: true, data: undefined })
  },
  play: async ({ canvasElement }) => {
    await openAndSubmit(canvasElement)
    await expect(await within(canvasElement).findByRole('status')).toHaveTextContent('Senha redefinida.')
  },
}

export const PasswordMismatch: Story = {
  beforeEach: () => {
    mocked(resetUserPassword).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { confirmation: ['As senhas não conferem.'] } })
  },
  play: async ({ canvasElement }) => {
    await openAndSubmit(canvasElement)
    await expect(await within(canvasElement).findByText('As senhas não conferem.')).toBeInTheDocument()
  },
}
