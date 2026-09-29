import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { secondSquadPlayerFixture, squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { RosterTable } from './roster-table'
import { RosterTableSkeleton } from './roster-table.skeleton'

const meta = {
  title: 'Players/RosterTable',
  component: RosterTable,
  args: {
    players: [squadPlayerFixture, secondSquadPlayerFixture, squadPlayerWithoutDetailsFixture],
    teamColor: '#1f4fa3',
    selectedPlayerId: squadPlayerFixture.id,
    searchText: '',
    hrefFor: (playerId: string) => `/elencos?atleta=${playerId}`,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ containerType: 'inline-size', display: 'flex', flexDirection: 'column', height: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RosterTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithPlayers: Story = {}

export const EmptyTeam: Story = { args: { players: [], selectedPlayerId: null } }

export const NoSearchMatch: Story = { args: { players: [], selectedPlayerId: null, searchText: 'Zeca' } }

export const SelectPlayer: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('link', { name: /Caio Henrique Batista/ }))
    await expect(args.onSelect).toHaveBeenCalledWith(secondSquadPlayerFixture.id)
  },
}

export const Loading: Story = { render: () => <RosterTableSkeleton /> }
