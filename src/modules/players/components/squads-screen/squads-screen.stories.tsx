import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { seasonTeamsFixture } from '@/modules/teams/components/team-list-item/team-list-item.fixtures'
import { SquadWorkspaceSkeleton } from '../squad-workspace/squad-workspace.skeleton'
import { SquadsScreen } from './squads-screen'
import { SquadsSkeleton } from './squads-screen.skeleton'

const meta = {
  title: 'Players/SquadsScreen',
  component: SquadsScreen,
  args: { year: 2025, teams: seasonTeamsFixture, children: <SquadWorkspaceSkeleton /> },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquadsScreen>

export default meta

type Story = StoryObj<typeof meta>

export const LoadingSquad: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('complementary', { name: 'Times' })).toBeInTheDocument()
  },
}

export const Loading: Story = { render: () => <SquadsSkeleton /> }
