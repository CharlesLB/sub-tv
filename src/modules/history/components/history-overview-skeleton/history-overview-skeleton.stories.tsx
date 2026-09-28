import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryOverviewSkeleton } from './history-overview-skeleton'

const meta = {
  title: 'History/HistoryOverviewSkeleton',
  component: HistoryOverviewSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HistoryOverviewSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
