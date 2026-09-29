import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SkeletonCell } from './skeleton-cell'

const meta = {
  title: 'History/SkeletonCell',
  component: SkeletonCell,
  args: { cellClassName: 'block w-[132px] text-[15.3px]', barClassName: 'w-[38px]', delayMs: 0 },
} satisfies Meta<typeof SkeletonCell>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}

export const RightAligned: Story = { args: { barClassName: 'ml-auto w-[38px]' } }
