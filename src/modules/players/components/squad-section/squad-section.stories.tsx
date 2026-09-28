import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { PLAYER_PARAMETER } from '@/lib/routes'
import { getLastChange } from '@/modules/audit/data/get-last-change'
import { seasonTeamFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { getTeamSquad } from '../../data/get-team-squad'
import { squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadSection } from './squad-section'

const meta = {
  title: 'Players/SquadSection',
  component: SquadSection,
  args: { year: 2025, team: seasonTeamFixture, categoryFilter: undefined, canEdit: false, requestedPlayerId: squadPlayerFixture.id },
  parameters: { layout: 'fullscreen', nextjs: { navigation: { query: { [PLAYER_PARAMETER]: squadPlayerFixture.id } } } },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 1, height: 640 }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getTeamSquad).mockResolvedValue(teamSquadFixture)
    mocked(getLastChange).mockResolvedValue({ userName: 'Marta Ribeiro', createdAt: '2025-06-01T15:30:00.000Z', actionLabel: 'Ficha do jogador alterada' })
  },
} satisfies Meta<typeof SquadSection>

export default meta

type Story = StoryObj<typeof meta>

export const WithSquad: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('region', { name: 'Elenco' })).toBeInTheDocument()
    await expect(await canvas.findByText('Última alteração: Marta Ribeiro · 01/06/2025 12:30')).toBeInTheDocument()
  },
}

export const WithoutSquad: Story = {
  beforeEach: () => {
    mocked(getTeamSquad).mockResolvedValue(null)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('heading', { name: 'Estrela do Vale SUB-14 sem elenco' })).toBeInTheDocument()
  },
}
