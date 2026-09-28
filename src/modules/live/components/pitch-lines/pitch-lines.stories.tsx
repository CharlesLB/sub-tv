import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PitchLines } from './pitch-lines'

const meta = {
  title: 'Live/PitchLines',
  component: PitchLines,
  decorators: [
    (Story) => (
      <div className="turf" style={{ position: 'relative', width: 525, aspectRatio: '105 / 64' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PitchLines>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
