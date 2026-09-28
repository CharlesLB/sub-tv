import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { AccumulatedTable } from './accumulated-table'
import { accumulatedTeamRowsFixture } from './accumulated-table.fixtures'

const meta = {
  title: 'History/AccumulatedTable',
  component: AccumulatedTable,
  args: { rows: accumulatedTeamRowsFixture, filter: loadedHistoryFilterFixture.filter },
} satisfies Meta<typeof AccumulatedTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithTeams: Story = {}

export const Empty: Story = { args: { rows: [] } }
