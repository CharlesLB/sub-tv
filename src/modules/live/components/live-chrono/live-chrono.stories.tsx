import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { runningFirstHalfClockFixture } from '../live-board/live-board.fixtures'
import { LiveChrono } from './live-chrono'
import {
  beforeKickoffClockFixture,
  endedClockFixture,
  endedWithoutRecordedClockFixture,
  halfTimeClockFixture,
  pausedFirstHalfClockFixture,
  runningSecondHalfClockFixture,
  TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS,
} from './live-chrono.fixtures'

const startedTwelveMinutesAgo = new Date(Date.now() - TWELVE_MINUTES_THIRTY_FOUR_SECONDS_MS).toISOString()

const meta = {
  title: 'Live/LiveChrono',
  component: LiveChrono,
  args: { clock: beforeKickoffClockFixture, onAdvance: fn() },
} satisfies Meta<typeof LiveChrono>

export default meta

type Story = StoryObj<typeof meta>

export const BeforeKickoff: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Clique para iniciar a partida' }))
    await expect(args.onAdvance).toHaveBeenCalledTimes(1)
  },
}

export const RunningFirstHalf: Story = {
  args: { clock: { ...runningFirstHalfClockFixture, startedAt: startedTwelveMinutesAgo } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Clique para ir ao intervalo' })).toHaveTextContent(/1ºT\d{2}:\d{2}/)
  },
}

export const PausedFirstHalf: Story = { args: { clock: pausedFirstHalfClockFixture } }

export const HalfTime: Story = { args: { clock: halfTimeClockFixture } }

export const RunningSecondHalf: Story = { args: { clock: { ...runningSecondHalfClockFixture, startedAt: startedTwelveMinutesAgo } } }

export const Ended: Story = {
  args: { clock: endedClockFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Jogo encerrado' })).toBeDisabled()
  },
}

export const EndedWithoutRecordedClock: Story = { args: { clock: endedWithoutRecordedClockFixture } }
