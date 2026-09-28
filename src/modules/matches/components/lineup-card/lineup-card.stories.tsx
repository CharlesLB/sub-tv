import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { LineupCard } from './lineup-card'
import { awayTeamFixture, homeTeamFixture, teamWithoutPlayersFixture } from './lineup-card.fixtures'

const meta = {
  title: 'Matches/LineupCard',
  component: LineupCard,
  args: {
    team: homeTeamFixture,
    category: CATEGORY.SUB14,
    sourceLine: 'Elenco 2026 · 14 Atletas vinculados ao SUB-14',
    starterIds: homeTeamFixture.defaultStarterIds,
    onToggle: fn(),
  },
} satisfies Meta<typeof LineupCard>

export default meta

type Story = StoryObj<typeof meta>

export const Complete: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('checkbox', { name: /Caio Ribeiro/ }))
    await expect(args.onToggle).toHaveBeenCalledWith('estrela-1')
  },
}

export const Incomplete: Story = {
  args: { team: awayTeamFixture, starterIds: awayTeamFixture.defaultStarterIds.slice(0, 9), sourceLine: 'Elenco 2026 · 13 Atletas vinculados ao SUB-14' },
}

export const WithoutPlayers: Story = { args: { team: teamWithoutPlayersFixture, starterIds: [], category: CATEGORY.SUB13, sourceLine: 'Elenco 2026 · 0 Atletas vinculados ao SUB-13' } }
