import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { liveTeamsFixture } from '../scoreboard-team/scoreboard-team.fixtures'
import { TimelineRow } from './timeline-row'
import { awayYellowCardItemFixture, halfTimeItemFixture, homeGoalItemFixture } from './timeline-row.fixtures'

const meta = {
  title: 'Live/TimelineRow',
  component: TimelineRow,
  args: { item: homeGoalItemFixture, teams: liveTeamsFixture },
} satisfies Meta<typeof TimelineRow>

export default meta

type Story = StoryObj<typeof meta>

export const HomeGoal: Story = {}

export const AwayYellowCard: Story = { args: { item: awayYellowCardItemFixture } }

export const HalfTimeMarker: Story = { args: { item: halfTimeItemFixture } }
