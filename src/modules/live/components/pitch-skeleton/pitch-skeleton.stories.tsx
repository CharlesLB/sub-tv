import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PitchSkeleton } from './pitch-skeleton'

const meta = {
  title: 'Live/PitchSkeleton',
  component: PitchSkeleton,
  decorators: [
    (Story) => (
      <div style={{ display: 'grid', height: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PitchSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
