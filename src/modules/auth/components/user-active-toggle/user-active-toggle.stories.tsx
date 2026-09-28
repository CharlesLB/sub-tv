import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { setUserActive } from '../../actions/user-admin-actions'
import { activeUserRowFixture, inactiveUserRowFixture } from '../users-table/users-table.fixtures'
import { UserActiveToggle } from './user-active-toggle'

const meta = {
  title: 'Auth/UserActiveToggle',
  component: UserActiveToggle,
  args: { userId: activeUserRowFixture.id, isActive: true, isCurrentUser: false },
} satisfies Meta<typeof UserActiveToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {}

export const Inactive: Story = { args: { userId: inactiveUserRowFixture.id, isActive: false } }

export const CurrentUser: Story = {
  args: { isCurrentUser: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Desativar' })).toBeDisabled()
  },
}

export const ChangeFailed: Story = {
  beforeEach: () => {
    mocked(setUserActive).mockResolvedValue({ ok: false, error: 'Não foi possível alterar o usuário.' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Desativar' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Não foi possível alterar o usuário.')
  },
}
