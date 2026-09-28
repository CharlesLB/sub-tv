import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { activeBroadcastFixture } from '../live-broadcast-chip/live-broadcast-chip.fixtures'
import { LiveChip } from './live-chip'

const meta = {
  title: 'Platform/LiveChip',
  component: LiveChip,
  args: {
    matchId: activeBroadcastFixture.matchId,
    matchup: 'Atlético Serrano × União Ribeirinha',
    closeBroadcast: fn(() => Promise.resolve()),
  },
  parameters: { nextjs: { navigation: { pathname: '/campeonatos' } } },
} satisfies Meta<typeof LiveChip>

export default meta

type Story = StoryObj<typeof meta>

export const OnAnotherPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTitle('Voltar à transmissão')).toHaveAttribute('href', `/ao-vivo/${activeBroadcastFixture.matchId}`)
    await expect(canvas.getByRole('button', { name: 'Fechar transmissão', hidden: true })).toBeInTheDocument()
  },
}

export const OnLiveBroadcast: Story = {
  parameters: { nextjs: { navigation: { pathname: `/ao-vivo/${activeBroadcastFixture.matchId}` } } },
}
