import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { timelineFixture } from '../event-chip/event-chip.fixtures'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'
import { ExpandedTimeline } from './expanded-timeline'

const meta = {
  title: 'Live/ExpandedTimeline',
  component: ExpandedTimeline,
  args: { items: timelineFixture, teams: liveSnapshotFixture.teams, showRotateNotice: false },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExpandedTimeline>

export default meta

type Story = StoryObj<typeof meta>

export const WithEvents: Story = {}

export const Empty: Story = { args: { items: [] } }

export const PortraitPhone: Story = { args: { showRotateNotice: true } }
