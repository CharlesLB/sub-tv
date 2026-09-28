import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChampionshipListSkeleton } from './championship-list-skeleton'

const meta = {
  title: 'Championships/ChampionshipListSkeleton',
  component: ChampionshipListSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipListSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
