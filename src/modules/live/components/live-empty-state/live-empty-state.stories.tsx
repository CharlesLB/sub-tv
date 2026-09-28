import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'
import { LiveEmptyState } from './live-empty-state'

const meta = {
  title: 'Live/LiveEmptyState',
  component: LiveEmptyState,
  args: { seasonId: liveSnapshotFixture.seasonId },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LiveEmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const WithoutLineup: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Nova partida' })).toHaveAttribute('href', '/campeonatos/season-1/nova-partida')
  },
}
