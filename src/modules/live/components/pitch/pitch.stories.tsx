import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useBoardInteractions } from '../../interaction/use-board-interactions'
import { LiveMatchProvider } from '../../state/live-context'
import { liveSnapshotFixture } from '../live-screen/live-screen.fixtures'
import { Pitch } from './pitch'

function PitchWithInteractions({ isCompact }: { isCompact: boolean }) {
  return <Pitch interactions={useBoardInteractions()} isCompact={isCompact} />
}

const meta = {
  title: 'Live/Pitch',
  component: PitchWithInteractions,
  args: { isCompact: false },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ display: 'grid', height: 420 }}>
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof PitchWithInteractions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const midfielder = canvas.getByRole('button', { name: 'Camisa 10 — Enzo Barbosa Lima' })

    midfielder.focus()
    await userEvent.keyboard('{Enter}')
    await expect(midfielder).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Compact: Story = {
  args: { isCompact: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Enzo')).toBeInTheDocument()
  },
}
