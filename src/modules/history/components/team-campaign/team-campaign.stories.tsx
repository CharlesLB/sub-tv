import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamCampaign } from './team-campaign'
import { teamSeasonsFixture } from './team-campaign.fixtures'
import { TeamCampaignSkeleton } from './team-campaign.skeleton'

const meta = {
  title: 'History/TeamCampaign',
  component: TeamCampaign,
  args: { seasons: teamSeasonsFixture },
} satisfies Meta<typeof TeamCampaign>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {}

export const Loading: Story = { render: () => <TeamCampaignSkeleton /> }
