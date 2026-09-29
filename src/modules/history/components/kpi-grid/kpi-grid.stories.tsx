import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { KpiGrid } from './kpi-grid'
import { kpisFixture } from './kpi-grid.fixtures'
import { KpiGridSkeleton } from './kpi-grid.skeleton'

const meta = {
  title: 'History/KpiGrid',
  component: KpiGrid,
  args: { kpis: kpisFixture, variant: 'detail' },
} satisfies Meta<typeof KpiGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Detail: Story = {}

export const Overview: Story = { args: { variant: 'overview' } }

export const Loading: Story = { render: () => <KpiGridSkeleton variant="detail" /> }

export const LoadingOverview: Story = { render: () => <KpiGridSkeleton variant="overview" /> }
