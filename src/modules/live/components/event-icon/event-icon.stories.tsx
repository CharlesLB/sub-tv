import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LIVE_EVENT_TYPE } from '@/modules/matches/client'
import { TIMELINE_MARKER } from '../../state/timeline'
import { homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventIcon } from './event-icon'

const meta = {
  title: 'Live/EventIcon',
  component: EventIcon,
  args: { kind: LIVE_EVENT_TYPE.GOAL, teamColor: homeTeamFixture.color, size: 24 },
} satisfies Meta<typeof EventIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Goal: Story = {}

export const GoalWithoutTeam: Story = { args: { teamColor: null } }

export const YellowCard: Story = { args: { kind: LIVE_EVENT_TYPE.YELLOW_CARD } }

export const RedCard: Story = { args: { kind: LIVE_EVENT_TYPE.RED_CARD } }

export const Substitution: Story = { args: { kind: LIVE_EVENT_TYPE.SUBSTITUTION } }

export const HalfTime: Story = { args: { kind: TIMELINE_MARKER.HALF_TIME } }

export const FullTime: Story = { args: { kind: TIMELINE_MARKER.FULL_TIME } }
