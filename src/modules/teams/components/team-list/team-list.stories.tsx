import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture, seasonTeamsFixture } from '../team-list-item/team-list-item.fixtures'
import { TeamList } from './team-list'

const meta = {
  title: 'Teams/TeamList',
  component: TeamList,
  args: { teams: seasonTeamsFixture, year: 2025, categoryFilter: undefined, activeTeamKey: seasonTeamFixture.key },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TeamList>

export default meta

type Story = StoryObj<typeof meta>

export const WithTeams: Story = {}

export const WithoutActiveTeam: Story = { args: { activeTeamKey: null } }

export const EmptyCategory: Story = { args: { teams: [], categoryFilter: CATEGORY.SUB13, activeTeamKey: null } }
