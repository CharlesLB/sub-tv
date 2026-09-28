import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture } from '../live-screen/live-screen.fixtures'
import { benchMatchStateFixture, busyMatchStateFixture, onPitchMatchStateFixture } from '../player-marks/player-marks.fixtures'
import { PlayerTooltip } from './player-tooltip'
import { reserveHoverFixture, strikerHoverFixture, strikerHoverNearTopFixture } from './player-tooltip.fixtures'

const meta = {
  title: 'Live/PlayerTooltip',
  component: PlayerTooltip,
  args: { hover: strikerHoverNearTopFixture, matchState: onPitchMatchStateFixture },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ height: 480 }}>
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof PlayerTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const OnPitch: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('tooltip')).toHaveTextContent('Davi Moreira Campos')
  },
}

export const WithMatchHighlights: Story = {
  args: { matchState: busyMatchStateFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Nesta partida')).toBeInTheDocument()
  },
}

export const AboveTheDot: Story = { args: { hover: strikerHoverFixture } }

export const Reserve: Story = {
  args: { hover: { ...reserveHoverFixture, anchor: { ...reserveHoverFixture.anchor, top: 100, bottom: 130 } }, matchState: benchMatchStateFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('União FC SUB-14 · Reserva')).toBeInTheDocument()
  },
}
