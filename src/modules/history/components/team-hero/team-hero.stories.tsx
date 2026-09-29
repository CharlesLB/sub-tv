import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TeamHero } from './team-hero'
import { teamHistoryFixture, teamWithoutSeasonsFixture } from './team-hero.fixtures'
import { TeamHeroSkeleton } from './team-hero.skeleton'

const meta = {
  title: 'History/TeamHero',
  component: TeamHero,
  args: { history: teamHistoryFixture },
} satisfies Meta<typeof TeamHero>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {}

export const WithoutSeasons: Story = { args: { history: teamWithoutSeasonsFixture } }

export const Loading: Story = { render: () => <TeamHeroSkeleton /> }
