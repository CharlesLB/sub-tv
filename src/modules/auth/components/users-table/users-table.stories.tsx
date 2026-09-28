import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { UsersTable } from './users-table'
import { currentUserRowFixture, userRowsFixture } from './users-table.fixtures'

const meta = {
  title: 'Auth/UsersTable',
  component: UsersTable,
  args: { users: userRowsFixture, currentUserId: currentUserRowFixture.id },
} satisfies Meta<typeof UsersTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithUsers: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Nunca entrou')).toBeInTheDocument()
  },
}

export const OnlyCurrentUser: Story = { args: { users: [currentUserRowFixture] } }
