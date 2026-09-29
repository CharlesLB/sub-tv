import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScoreboardTeam } from './scoreboard-team'
import { awayTeamFixture, homeTeamFixture, homeTeamWithCrestFixture } from './scoreboard-team.fixtures'

const meta = {
  title: 'Live/ScoreboardTeam',
  component: ScoreboardTeam,
  args: { team: homeTeamFixture },
} satisfies Meta<typeof ScoreboardTeam>

export default meta

type Story = StoryObj<typeof meta>

export const Home: Story = {}

export const Away: Story = { args: { team: awayTeamFixture } }

export const WithCrest: Story = { args: { team: homeTeamWithCrestFixture } }
