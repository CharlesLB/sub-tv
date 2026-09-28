import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getActiveBroadcast } from '@/modules/matches/data/get-active-broadcast'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { RailWithBroadcast } from './rail-with-broadcast'

const meta = {
  title: 'Platform/RailWithBroadcast',
  component: RailWithBroadcast,
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/campeonatos' } } },
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)
  },
} satisfies Meta<typeof RailWithBroadcast>

export default meta

type Story = StoryObj<typeof meta>

export const WithBroadcast: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('link', { name: 'Ao vivo' })).toBeInTheDocument()
  },
}

export const WithoutBroadcast: Story = {
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(null)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    await expect(canvas.queryByRole('link', { name: 'Ao vivo' })).not.toBeInTheDocument()
  },
}
