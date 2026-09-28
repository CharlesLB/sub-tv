import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PlatformRailSkeleton } from './platform-rail-skeleton'

const meta = {
  title: 'Platform/PlatformRailSkeleton',
  component: PlatformRailSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PlatformRailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
