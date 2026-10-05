import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PLAYER_PARAMETER } from '@/lib/routes'
import { EditorAccessProvider } from '@/modules/auth/client'
import { secondSquadPlayerFixture, squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { emptyTeamSquadFixture, teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { SquadWorkspace } from './squad-workspace'
import { SquadWorkspaceSkeleton } from './squad-workspace.skeleton'

const meta = {
  title: 'Players/SquadWorkspace',
  component: SquadWorkspace,
  args: { squad: teamSquadFixture, categoryFilter: undefined, lastChange: { playerId: squadPlayerFixture.id, content: null } },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 1, height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquadWorkspace>

export default meta

type Story = StoryObj<typeof meta>

export const FirstPlayerSelected: Story = {}

export const RequestedPlayer: Story = {
  args: { lastChange: { playerId: secondSquadPlayerFixture.id, content: null } },
  parameters: { nextjs: { navigation: { query: { [PLAYER_PARAMETER]: secondSquadPlayerFixture.id } } } },
  play: async ({ canvasElement }) => {
    const sheet = within(canvasElement).getByRole('complementary', { name: 'Ficha do jogador' })

    await expect(within(sheet).getByLabelText('Nome')).toHaveValue(secondSquadPlayerFixture.fullName)
  },
}

export const Editable: Story = {
  decorators: [
    (Story) => (
      <EditorAccessProvider canEdit>
        <Story />
      </EditorAccessProvider>
    ),
  ],
}

export const EmptySquad: Story = { args: { squad: emptyTeamSquadFixture } }

export const SearchRoster: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Buscar atleta por nome ou número' }), 'caio')
    await expect(within(canvas.getByRole('region', { name: 'Elenco' })).getAllByRole('link')).toHaveLength(1)
  },
}

export const LoadingSelectedPlayer: Story = {
  parameters: { nextjs: { navigation: { query: { [PLAYER_PARAMETER]: secondSquadPlayerFixture.id } } } },
  play: async () => {
    await expect(within(document.body).getByRole('progressbar', { name: 'Carregando página' })).toBeInTheDocument()
  },
}

export const Loading: Story = { render: () => <SquadWorkspaceSkeleton /> }
