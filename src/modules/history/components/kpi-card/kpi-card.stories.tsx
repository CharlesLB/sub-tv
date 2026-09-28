import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { KpiCard } from './kpi-card'

const meta = {
  title: 'History/KpiCard',
  component: KpiCard,
  args: { label: 'Gols', value: '17', index: 0, variant: 'detail' },
} satisfies Meta<typeof KpiCard>

export default meta

type Story = StoryObj<typeof meta>

export const Detail: Story = {}

export const Overview: Story = { args: { label: 'Partidas', value: '180', variant: 'overview' } }
