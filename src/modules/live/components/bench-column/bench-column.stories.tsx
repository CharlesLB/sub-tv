import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SIDE } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { PLAYER } from '../../state/live-state.fixtures'
import { useLiveCommands } from '../../state/use-live-commands'
import { subbedOutMatchStateFixture } from '../bench-dot/bench-dot.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { BenchColumn } from './bench-column'
import { makeBoardInteractions } from './bench-column.fixtures'

const PendingSubstitution = () => {
  const { startSubstitution } = useLiveCommands()

  useEffect(() => {
    startSubstitution()
  }, [startSubstitution])

  return null
}

const meta = {
  title: 'Live/BenchColumn',
  component: BenchColumn,
  args: { side: SIDE.HOME, interactions: makeBoardInteractions({ activateBenchPlayer: fn() }) },
  beforeEach: silenceLiveStream,
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', height: 360 }}>
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof BenchColumn>

export default meta

type Story = StoryObj<typeof meta>

export const HomeBench: Story = {
  play: async ({ args, canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'Reserva camisa 12 — Caio Brandão' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.interactions.activateBenchPlayer).toHaveBeenCalledWith(PLAYER.HOME_RESERVE)
  },
}

export const AwayBench: Story = { args: { side: SIDE.AWAY } }

export const WithSubstitutedStarter: Story = {
  args: { interactions: makeBoardInteractions({ playerStates: { ...makeBoardInteractions().playerStates, [PLAYER.HOME_MIDFIELDER]: subbedOutMatchStateFixture } }) },
}

export const AwaitingEntry: Story = {
  decorators: [
    (Story) => (
      <>
        <PendingSubstitution />
        <Story />
      </>
    ),
  ],
}
