import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { type LiveMatchSnapshot, updateLiveClock } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture, liveSnapshotWithEventsFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { endedClockFixture, TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS } from '../live-chrono/live-chrono.fixtures'
import { LiveScoreboard } from './live-scoreboard'

const withLiveMatch = (snapshot: LiveMatchSnapshot): Decorator => {
  const LiveMatchDecorator: Decorator = (Story) => (
    <LiveMatchProvider snapshot={snapshot}>
      <Story />
    </LiveMatchProvider>
  )

  return LiveMatchDecorator
}

const meta = {
  title: 'Live/LiveScoreboard',
  component: LiveScoreboard,
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(updateLiveClock).mockResolvedValue({ ok: true, data: { statusChanged: false } })

    return silenceLiveStream()
  },
} satisfies Meta<typeof LiveScoreboard>

export default meta

type Story = StoryObj<typeof meta>

export const BeforeKickoff: Story = {
  decorators: [withLiveMatch(liveSnapshotFixture)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('group', { name: 'União FC 0 × 0 Serra Azul' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Clique para iniciar a partida' }))
    await expect(await canvas.findByText('Ao vivo')).toBeInTheDocument()
  },
}

export const Running: Story = {
  decorators: [
    withLiveMatch({
      ...liveSnapshotWithEventsFixture,
      clock: { ...liveSnapshotWithEventsFixture.clock, startedAt: new Date(Date.now() - TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS).toISOString() },
    }),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('group', { name: 'União FC 1 × 0 Serra Azul' })).toBeInTheDocument()
  },
}

export const Ended: Story = {
  decorators: [withLiveMatch({ ...liveSnapshotWithEventsFixture, clock: endedClockFixture })],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Jogo encerrado' })).toBeDisabled()
  },
}
