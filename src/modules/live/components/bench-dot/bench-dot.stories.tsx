import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { homeReserveFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { BenchDot } from './bench-dot'
import { reserveMatchStateFixture, subbedOutMatchStateFixture } from './bench-dot.fixtures'

const meta = {
  title: 'Live/BenchDot',
  component: BenchDot,
  args: {
    player: homeReserveFixture,
    matchState: reserveMatchStateFixture,
    teamColor: homeTeamFixture.color,
    isDragged: false,
    isHighlighted: false,
    onPointerDown: fn(),
    onHoverStart: fn(),
    onHoverEnd: fn(),
    onKeyboardActivate: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 120 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BenchDot>

export default meta

type Story = StoryObj<typeof meta>

export const Available: Story = {
  play: async ({ args, canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'Reserva camisa 12 — Caio Brandão' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onKeyboardActivate).toHaveBeenCalledWith(homeReserveFixture.playerId)
  },
}

export const Highlighted: Story = { args: { isHighlighted: true } }

export const Dragged: Story = { args: { isDragged: true } }

export const SubbedOut: Story = {
  args: { matchState: subbedOutMatchStateFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Reserva camisa 12 — Caio Brandão (substituído)' })).toHaveAttribute('aria-disabled', 'true')
  },
}
