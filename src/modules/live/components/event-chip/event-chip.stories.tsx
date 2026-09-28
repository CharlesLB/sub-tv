import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { awayTeamFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventChip } from './event-chip'
import { goalItemFixture, halfTimeItemFixture, yellowCardItemFixture } from './event-chip.fixtures'

const meta = {
  title: 'Live/EventChip',
  component: EventChip,
  args: { item: goalItemFixture, teamColor: homeTeamFixture.color, isNewest: false },
} satisfies Meta<typeof EventChip>

export default meta

type Story = StoryObj<typeof meta>

export const Goal: Story = {}

export const NewestGoal: Story = { args: { isNewest: true } }

export const YellowCard: Story = { args: { item: yellowCardItemFixture, teamColor: awayTeamFixture.color } }

export const HalfTimeMarker: Story = { args: { item: halfTimeItemFixture, teamColor: null } }
