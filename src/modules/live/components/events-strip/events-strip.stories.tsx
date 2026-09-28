import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SIDE } from '@/modules/matches/client'
import { timelineFixture } from '../event-chip/event-chip.fixtures'
import { awayTeamFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventsStrip } from './events-strip'

const KNOWN_A11Y_GAPS = [
  { id: 'color-contrast', enabled: false },
  { id: 'scrollable-region-focusable', enabled: false },
]

const meta = {
  title: 'Live/EventsStrip',
  component: EventsStrip,
  args: {
    items: timelineFixture,
    teamColors: { [SIDE.HOME]: homeTeamFixture.color, [SIDE.AWAY]: awayTeamFixture.color },
    isExpanded: false,
    canExpand: true,
    onToggleExpanded: fn(),
  },
  parameters: { layout: 'fullscreen', a11y: { config: { rules: KNOWN_A11Y_GAPS } } },
} satisfies Meta<typeof EventsStrip>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { items: [] } }

export const WithEvents: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Expandir a linha do tempo' }))
    await expect(args.onToggleExpanded).toHaveBeenCalledTimes(1)
  },
}

export const Expanded: Story = { args: { isExpanded: true } }

export const WithoutExpandToggle: Story = { args: { canExpand: false } }

export const Overflowing: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('button', { name: 'Próximos eventos' })).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Eventos anteriores' })).toBeDisabled()
  },
}
