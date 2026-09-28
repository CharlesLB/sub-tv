import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BestSeasonBanner } from './best-season-banner'
import { bestSeasonFixture, singleGoalSeasonFixture } from './best-season-banner.fixtures'

const meta = {
  title: 'History/BestSeasonBanner',
  component: BestSeasonBanner,
  args: { season: bestSeasonFixture },
} satisfies Meta<typeof BestSeasonBanner>

export default meta

type Story = StoryObj<typeof meta>

export const SeveralGoals: Story = {}

export const SingleGoal: Story = { args: { season: singleGoalSeasonFixture } }
