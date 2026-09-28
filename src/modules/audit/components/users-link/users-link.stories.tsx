import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UsersLink } from './users-link'

const meta = {
  title: 'Audit/UsersLink',
  component: UsersLink,
} satisfies Meta<typeof UsersLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
