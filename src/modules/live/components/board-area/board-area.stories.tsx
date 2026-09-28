import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { LiveMatchProvider } from '../../state/live-context'
import { makeBoardInteractions } from '../bench-column/bench-column.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { BoardArea } from './board-area'

const meta = {
  title: 'Live/BoardArea',
  component: BoardArea,
  args: { interactions: makeBoardInteractions(), isCompact: false },
  parameters: { layout: 'fullscreen' },
  beforeEach: silenceLiveStream,
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ display: 'flex', flexDirection: 'column', height: 480 }}>
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Camisa 9 — Davi Moreira' })).toBeInTheDocument()
  },
} satisfies Meta<typeof BoardArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = { args: { isCompact: true } }
