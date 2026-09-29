import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { cruzeiroBadgeFixture } from '../accumulated-table/accumulated-table.fixtures'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { TeamScorers } from './team-scorers'
import { teamScorersFixture } from './team-scorers.fixtures'
import { TeamScorersSkeleton } from './team-scorers.skeleton'

const meta = {
  title: 'History/TeamScorers',
  component: TeamScorers,
  args: { scorers: teamScorersFixture, color: cruzeiroBadgeFixture.color, filter: loadedHistoryFilterFixture.filter },
} satisfies Meta<typeof TeamScorers>

export default meta

type Story = StoryObj<typeof meta>

export const WithScorers: Story = {}

export const Empty: Story = { args: { scorers: [] } }

export const Loading: Story = { render: () => <TeamScorersSkeleton /> }
