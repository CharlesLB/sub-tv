import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { KpiGridSkeleton } from './kpi-grid-skeleton'

const meta = {
  title: 'History/KpiGridSkeleton',
  component: KpiGridSkeleton,
  args: { count: 4, variant: 'overview' },
} satisfies Meta<typeof KpiGridSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {}

export const Detail: Story = { args: { variant: 'detail' } }

export const Highlight: Story = { args: { count: 3, variant: 'highlight' } }
