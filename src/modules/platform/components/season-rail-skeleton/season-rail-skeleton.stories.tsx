import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SeasonRailSkeleton } from './season-rail-skeleton'

const meta = {
  title: 'Platform/SeasonRailSkeleton',
  component: SeasonRailSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SeasonRailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
