import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LivePill } from './live-pill'

const meta = {
  title: 'Live/LivePill',
  component: LivePill,
} satisfies Meta<typeof LivePill>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
