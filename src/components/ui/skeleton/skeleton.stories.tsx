import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Skeleton } from './skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  args: { className: 'h-4 w-[260px]' },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Line: Story = {}

export const Chip: Story = { args: { className: 'h-[30px] w-[180px] rounded-card', delayMs: 160 } }
