import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamsFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { getTeamSquad } from '../../data/get-team-squad'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadPanel } from './squad-panel'

const meta = {
  title: 'Players/SquadPanel',
  component: SquadPanel,
  args: { year: 2025, teams: seasonTeamsFixture, query: { category: undefined, teamKey: undefined }, canEdit: false, requestedPlayerId: undefined },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 640 }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)
  },
} satisfies Meta<typeof SquadPanel>

export default meta

type Story = StoryObj<typeof meta>

export const SelectedTeam: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('region', { name: 'Elenco' })).toBeInTheDocument()
  },
}

export const SeasonWithoutTeams: Story = {
  args: { teams: [] },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('heading', { name: 'Nenhum elenco em 2025 ainda' })).toBeInTheDocument()
  },
}

export const NoTeamInCategory: Story = {
  args: { teams: [], query: { category: CATEGORY.SUB13, teamKey: undefined } },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('heading', { name: 'Nenhum time SUB-13 em 2025' })).toBeInTheDocument()
  },
}
