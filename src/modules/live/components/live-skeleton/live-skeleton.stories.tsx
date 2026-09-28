import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LiveSkeleton } from './live-skeleton'

const meta = {
  title: 'Live/LiveSkeleton',
  component: LiveSkeleton,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiveSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
