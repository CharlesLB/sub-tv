import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../lib/categories/categories'
import { SEASON_ID_FIXTURE, undatedMatchFixture } from '../match-card/match-card.fixtures'
import { seasonMatchesFixture } from '../round-panel/round-panel.fixtures'
import { MatchGrid } from './match-grid'

const meta = {
  title: 'Championships/MatchGrid',
  component: MatchGrid,
  args: { matches: [...seasonMatchesFixture, undatedMatchFixture], seasonId: SEASON_ID_FIXTURE, category: CATEGORY.SUB14 },
} satisfies Meta<typeof MatchGrid>

export default meta

type Story = StoryObj<typeof meta>

export const GroupedByRound: Story = {}

export const Empty: Story = { args: { matches: [], category: CATEGORY.SUB13 } }
