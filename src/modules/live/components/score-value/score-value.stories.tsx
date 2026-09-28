import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScoreValue } from './score-value'

const meta = {
  title: 'Live/ScoreValue',
  component: ScoreValue,
  args: { value: 0, pulseCount: 0 },
} satisfies Meta<typeof ScoreValue>

export default meta

type Story = StoryObj<typeof meta>

export const Resting: Story = {}

export const Pulsing: Story = { args: { value: 2, pulseCount: 1 } }
