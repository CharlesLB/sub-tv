import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AthleteHero } from './athlete-hero'
import { athleteHistoryFixture, athleteWithoutTeamFixture } from './athlete-hero.fixtures'
import { AthleteHeroSkeleton } from './athlete-hero.skeleton'

const meta = {
  title: 'History/AthleteHero',
  component: AthleteHero,
  args: { history: athleteHistoryFixture },
} satisfies Meta<typeof AthleteHero>

export default meta

type Story = StoryObj<typeof meta>

export const WithTeam: Story = {}

export const WithoutTeam: Story = { args: { history: athleteWithoutTeamFixture } }

export const Loading: Story = { render: () => <AthleteHeroSkeleton /> }
