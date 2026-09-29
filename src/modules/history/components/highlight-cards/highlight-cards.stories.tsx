import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { topPeriodScorerFixture } from '../period-scorers/period-scorers.fixtures'
import { HighlightCards } from './highlight-cards'
import { emptyHistoryOverviewFixture, historyOverviewFixture } from './highlight-cards.fixtures'
import { HighlightCardsSkeleton } from './highlight-cards.skeleton'

const meta = {
  title: 'History/HighlightCards',
  component: HighlightCards,
  args: { overview: historyOverviewFixture, filter: loadedHistoryFilterFixture.filter },
} satisfies Meta<typeof HighlightCards>

export default meta

type Story = StoryObj<typeof meta>

export const AllHighlights: Story = {}

export const OnlyTopScorer: Story = { args: { overview: { ...emptyHistoryOverviewFixture, scorers: [topPeriodScorerFixture] } } }

export const WithoutHighlights: Story = { args: { overview: emptyHistoryOverviewFixture } }

export const Loading: Story = { render: () => <HighlightCardsSkeleton /> }
