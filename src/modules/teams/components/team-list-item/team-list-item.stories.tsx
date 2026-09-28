import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamListItem } from './team-list-item'
import { seasonTeamFixture, secondSeasonTeamFixture } from './team-list-item.fixtures'

const meta = {
  title: 'Teams/TeamListItem',
  component: TeamListItem,
  args: { team: seasonTeamFixture, year: 2025, categoryFilter: undefined, isActive: false },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 250 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TeamListItem>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Active: Story = { args: { isActive: true } }

export const Sub13Team: Story = { args: { team: secondSeasonTeamFixture, isActive: true } }
