import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture, seasonTeamsFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { getTeamSquad } from '../../data/get-team-squad'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadsScreen } from './squads-screen'

const meta = {
  title: 'Players/SquadsScreen',
  component: SquadsScreen,
  args: { year: 2025, teams: seasonTeamsFixture, categoryFilter: undefined, selectedTeam: seasonTeamFixture, canEdit: false, requestedPlayerId: undefined },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)
  },
} satisfies Meta<typeof SquadsScreen>

export default meta

type Story = StoryObj<typeof meta>

export const SelectedTeam: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('region', { name: 'Elenco' })).toBeInTheDocument()
  },
}

export const WithoutSelectedTeam: Story = {
  args: { selectedTeam: null },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).toBeInTheDocument()
  },
}

export const NoTeamInCategory: Story = {
  args: { teams: [], categoryFilter: CATEGORY.SUB13, selectedTeam: null },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('heading', { name: 'Nenhum time SUB-13 em 2025' })).toBeInTheDocument()
  },
}
