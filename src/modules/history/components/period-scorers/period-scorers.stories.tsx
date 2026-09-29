import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { PeriodScorers } from './period-scorers'
import { periodScorersFixture } from './period-scorers.fixtures'
import { PeriodScorersSkeleton } from './period-scorers.skeleton'

const meta = {
  title: 'History/PeriodScorers',
  component: PeriodScorers,
  args: { scorers: periodScorersFixture, filter: loadedHistoryFilterFixture.filter },
} satisfies Meta<typeof PeriodScorers>

export default meta

type Story = StoryObj<typeof meta>

export const WithScorers: Story = {}

export const Empty: Story = { args: { scorers: [] } }

export const Loading: Story = { render: () => <PeriodScorersSkeleton /> }
