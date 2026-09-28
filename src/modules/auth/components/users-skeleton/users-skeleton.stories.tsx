import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UsersSkeleton } from './users-skeleton'

const meta = {
  title: 'Auth/UsersSkeleton',
  component: UsersSkeleton,
} satisfies Meta<typeof UsersSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
