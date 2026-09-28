import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { recordLiveEvent, updateLiveClock } from '@/modules/matches/client'
import { LiveBoard } from './live-board'
import { liveSnapshotFixture, liveSnapshotWithEventsFixture, officialsItemsFixture, silenceLiveStream } from './live-board.fixtures'

const meta = {
  title: 'Live/LiveBoard',
  component: LiveBoard,
  args: { snapshot: liveSnapshotFixture, officialsItems: officialsItemsFixture },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })
    mocked(updateLiveClock).mockResolvedValue({ ok: true, data: { statusChanged: false } })

    return silenceLiveStream()
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiveBoard>

export default meta

type Story = StoryObj<typeof meta>

export const BeforeKickoff: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('group', { name: 'União FC 0 × 0 Serra Azul' })).toBeInTheDocument()
    await userEvent.keyboard('g')
    await expect(await canvas.findByRole('group', { name: 'União FC 1 × 0 Serra Azul' })).toBeInTheDocument()
  },
}

export const WithEvents: Story = {
  args: { snapshot: { ...liveSnapshotWithEventsFixture, clock: { ...liveSnapshotWithEventsFixture.clock, startedAt: new Date().toISOString() } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('2 Eventos')).toBeInTheDocument()
    await userEvent.keyboard('c')
    await expect(await canvas.findByRole('dialog', { name: 'Escolher cartão' })).toBeInTheDocument()
  },
}
