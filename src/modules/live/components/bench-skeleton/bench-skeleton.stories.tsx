import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BenchSkeleton } from './bench-skeleton'

const meta = {
  title: 'Live/BenchSkeleton',
  component: BenchSkeleton,
  args: { delayOffsetMs: 0 },
  decorators: [
    (Story) => (
      <div style={{ width: 120 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BenchSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Delayed: Story = { args: { delayOffsetMs: 300 } }
