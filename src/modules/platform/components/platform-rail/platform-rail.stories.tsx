import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { PlatformRail } from './platform-rail'

const meta = {
  title: 'Platform/PlatformRail',
  component: PlatformRail,
  args: { liveMatchId: null },
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/campeonatos', query: { temporada: '2025' } } } },
} satisfies Meta<typeof PlatformRail>

export default meta

type Story = StoryObj<typeof meta>

export const OnChampionships: Story = {
  play: async ({ canvasElement }) => {
    const championshipsLink = within(canvasElement).getByRole('link', { name: 'Campeonatos' })

    await expect(championshipsLink).toHaveAttribute('aria-current', 'page')
    await expect(championshipsLink).toHaveAttribute('href', '/campeonatos?temporada=2025')
  },
}

export const DuringBroadcast: Story = { args: { liveMatchId: activeBroadcastFixture.matchId } }

export const OnLiveBroadcast: Story = {
  args: { liveMatchId: activeBroadcastFixture.matchId },
  parameters: { nextjs: { navigation: { pathname: `/ao-vivo/${activeBroadcastFixture.matchId}`, query: {} } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Ao vivo' })).toHaveAttribute('aria-current', 'page')
  },
}
