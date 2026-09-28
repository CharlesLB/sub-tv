import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamListSkeleton } from './team-list-skeleton'

const meta = {
  title: 'Teams/TeamListSkeleton',
  component: TeamListSkeleton,
} satisfies Meta<typeof TeamListSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
