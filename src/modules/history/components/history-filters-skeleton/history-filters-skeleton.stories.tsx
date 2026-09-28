import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryFiltersSkeleton } from './history-filters-skeleton'

const meta = {
  title: 'History/HistoryFiltersSkeleton',
  component: HistoryFiltersSkeleton,
} satisfies Meta<typeof HistoryFiltersSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
