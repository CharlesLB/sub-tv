import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryDetailSkeleton } from './history-detail-skeleton'

const meta = {
  title: 'History/HistoryDetailSkeleton',
  component: HistoryDetailSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HistoryDetailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
