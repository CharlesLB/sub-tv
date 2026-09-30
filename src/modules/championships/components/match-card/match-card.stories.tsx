import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../lib/categories/categories'
import { MatchCard } from './match-card'
import { cancelledMatchFixture, finishedMatchFixture, liveMatchFixture, penaltiesMatchFixture, SEASON_ID_FIXTURE, scheduledMatchFixture, undatedMatchFixture } from './match-card.fixtures'

const meta = {
  title: 'Championships/MatchCard',
  component: MatchCard,
  args: { match: finishedMatchFixture, seasonId: SEASON_ID_FIXTURE, category: CATEGORY.SUB14 },
} satisfies Meta<typeof MatchCard>

export default meta

type Story = StoryObj<typeof meta>

export const Finished: Story = {}

export const DecidedOnPenalties: Story = { args: { match: penaltiesMatchFixture } }

export const LiveBroadcast: Story = { args: { match: liveMatchFixture } }

export const Scheduled: Story = { args: { match: scheduledMatchFixture, category: CATEGORY.SUB13 } }

export const PostponedWithoutDate: Story = { args: { match: undatedMatchFixture } }

export const Cancelled: Story = { args: { match: cancelledMatchFixture } }
