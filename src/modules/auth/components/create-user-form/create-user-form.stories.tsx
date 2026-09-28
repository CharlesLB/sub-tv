import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { createUser } from '../../actions/user-admin-actions'
import { CreateUserForm } from './create-user-form'

const fillAndSubmit = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)

  await userEvent.type(canvas.getByLabelText(/^Nome/), 'Marina Couto')
  await userEvent.type(canvas.getByLabelText(/^Senha/), 'segredo123')
  await userEvent.type(canvas.getByLabelText(/^Confirmação/), 'segredo123')
  await userEvent.click(canvas.getByRole('button', { name: 'Criar usuário' }))
}

const meta = {
  title: 'Auth/CreateUserForm',
  component: CreateUserForm,
} satisfies Meta<typeof CreateUserForm>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Created: Story = {
  beforeEach: () => {
    mocked(createUser).mockResolvedValue({ ok: true, data: { username: 'Marina Couto' } })
  },
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement)
    await expect(await within(canvasElement).findByRole('status')).toHaveTextContent('Usuário “Marina Couto” criado.')
  },
}

export const InvalidFields: Story = {
  beforeEach: () => {
    mocked(createUser).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { confirmation: ['As senhas não conferem.'] } })
  },
  play: async ({ canvasElement }) => {
    await fillAndSubmit(canvasElement)
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent('Confira os campos.')
    await expect(within(canvasElement).getByText('As senhas não conferem.')).toBeInTheDocument()
  },
}
