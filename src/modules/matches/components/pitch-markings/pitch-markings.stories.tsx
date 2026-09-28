import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PitchMarkings } from './pitch-markings'

const meta = {
  title: 'Matches/PitchMarkings',
  component: PitchMarkings,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 420, aspectRatio: '105 / 64', background: 'var(--gr0)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PitchMarkings>

export default meta

type Story = StoryObj<typeof meta>

export const Pitch: Story = {}
