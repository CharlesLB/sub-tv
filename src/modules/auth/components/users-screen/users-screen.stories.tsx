import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getUsers } from '../../data/get-users'
import { requireUser } from '../../services/current-user'
import { signedInUserFixture } from '../user-chip/user-chip.fixtures'
import { userRowsFixture } from '../users-table/users-table.fixtures'
import { UsersScreen } from './users-screen'

const meta = {
  title: 'Auth/UsersScreen',
  component: UsersScreen,
  beforeEach: () => {
    mocked(requireUser).mockResolvedValue(signedInUserFixture)
    mocked(getUsers).mockResolvedValue(userRowsFixture)
  },
} satisfies Meta<typeof UsersScreen>

export default meta

type Story = StoryObj<typeof meta>

export const WithUsers: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('table', { name: 'Usuários' })).toBeInTheDocument()
    await expect(canvas.getByRole('form', { name: 'Novo usuário' })).toBeInTheDocument()
  },
}
