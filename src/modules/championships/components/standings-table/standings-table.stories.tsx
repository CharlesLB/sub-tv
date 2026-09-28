import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../categories'
import { StandingsTable } from './standings-table'
import { namedGroupFixture, singleGroupFixture } from './standings-table.fixtures'

const meta = {
  title: 'Championships/StandingsTable',
  component: StandingsTable,
  args: { group: singleGroupFixture, category: CATEGORY.SUB14 },
} satisfies Meta<typeof StandingsTable>

export default meta

type Story = StoryObj<typeof meta>

export const SingleGroup: Story = {}

export const NamedGroup: Story = { args: { group: namedGroupFixture, category: CATEGORY.SUB13 } }
