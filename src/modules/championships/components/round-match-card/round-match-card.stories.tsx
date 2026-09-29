import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { finishedMatchFixture, liveMatchFixture, SEASON_ID_FIXTURE, scheduledMatchFixture, undatedMatchFixture } from '../match-card/match-card.fixtures'
import { RoundMatchCard } from './round-match-card'
import { RoundMatchCardSkeleton } from './round-match-card.skeleton'

const meta = {
  title: 'Championships/RoundMatchCard',
  component: RoundMatchCard,
  args: { match: finishedMatchFixture, seasonId: SEASON_ID_FIXTURE },
} satisfies Meta<typeof RoundMatchCard>

export default meta

type Story = StoryObj<typeof meta>

export const Finished: Story = {}

export const LiveBroadcast: Story = { args: { match: liveMatchFixture } }

export const Scheduled: Story = { args: { match: scheduledMatchFixture } }

export const WithoutDate: Story = { args: { match: undatedMatchFixture } }

export const Loading: Story = { render: () => <RoundMatchCardSkeleton index={0} /> }
