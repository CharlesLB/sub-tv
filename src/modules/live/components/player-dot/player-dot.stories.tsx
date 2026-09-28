import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { busyMatchStateFixture, directRedMatchStateFixture, onPitchMatchStateFixture } from '../player-marks/player-marks.fixtures'
import { homeTeamFixture } from '../scoreboard-team/scoreboard-team.fixtures'
import { PlayerDot } from './player-dot'
import { homeStrikerFixture } from './player-dot.fixtures'

const meta = {
  title: 'Live/PlayerDot',
  component: PlayerDot,
  args: {
    player: homeStrikerFixture,
    matchState: onPitchMatchStateFixture,
    point: { x: 50, y: 50 },
    teamColor: homeTeamFixture.color,
    isSelected: false,
    isDragged: false,
    isDropTarget: false,
    isCompact: false,
    onPointerDown: fn(),
    onHoverStart: fn(),
    onHoverEnd: fn(),
    onKeyboardActivate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="turf" style={{ position: 'relative', width: 420, aspectRatio: '105 / 64', containerType: 'size' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerDot>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const dot = within(canvasElement).getByRole('button', { name: 'Camisa 9 — Davi Moreira Campos' })

    dot.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onKeyboardActivate).toHaveBeenCalledWith(homeStrikerFixture.playerId, dot)
  },
}

export const Selected: Story = { args: { isSelected: true } }

export const WithMatchMarks: Story = { args: { matchState: busyMatchStateFixture } }

export const SentOff: Story = { args: { matchState: directRedMatchStateFixture } }

export const DropTarget: Story = { args: { isDropTarget: true } }

export const Compact: Story = { args: { isCompact: true } }
