import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../lib/categories/categories'
import { TopScorersTable } from './top-scorers-table'
import { topScorersFixture } from './top-scorers-table.fixtures'

const meta = {
  title: 'Championships/TopScorersTable',
  component: TopScorersTable,
  args: { scorers: topScorersFixture, category: CATEGORY.SUB14 },
} satisfies Meta<typeof TopScorersTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithScorers: Story = {}

export const WithoutGoals: Story = { args: { scorers: [], category: CATEGORY.SUB13 } }
