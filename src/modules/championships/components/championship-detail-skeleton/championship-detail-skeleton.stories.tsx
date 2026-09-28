import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChampionshipDetailSkeleton } from './championship-detail-skeleton'

const meta = {
  title: 'Championships/ChampionshipDetailSkeleton',
  component: ChampionshipDetailSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipDetailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
