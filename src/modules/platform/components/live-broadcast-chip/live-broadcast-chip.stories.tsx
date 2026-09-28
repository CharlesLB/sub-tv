import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, waitFor, within } from 'storybook/test'
import { getActiveBroadcast } from '@/modules/matches/data/get-active-broadcast'
import { LiveBroadcastChip } from './live-broadcast-chip'
import { activeBroadcastFixture } from './live-broadcast-chip.fixtures'

const meta = {
  title: 'Platform/LiveBroadcastChip',
  component: LiveBroadcastChip,
  parameters: { nextjs: { navigation: { pathname: '/campeonatos' } } },
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(activeBroadcastFixture)
  },
} satisfies Meta<typeof LiveBroadcastChip>

export default meta

type Story = StoryObj<typeof meta>

export const Broadcasting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Atlético Serrano × União Ribeirinha')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Fechar transmissão', hidden: true })).toBeInTheDocument()
  },
}

export const WithoutBroadcast: Story = {
  beforeEach: () => {
    mocked(getActiveBroadcast).mockResolvedValue(null)
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(getActiveBroadcast).toHaveBeenCalled())
    await expect(within(canvasElement).queryByRole('link')).not.toBeInTheDocument()
  },
}
