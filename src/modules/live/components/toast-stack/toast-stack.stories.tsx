import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { recordLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { PLAYER } from '../../state/live-state.fixtures'
import { useLiveCommands } from '../../state/use-live-commands'
import { liveSnapshotFixture } from '../live-screen/live-screen.fixtures'
import { ToastStack } from './toast-stack'

function RecordGoalButton() {
  const { recordGoal } = useLiveCommands()

  return (
    <button type="button" onClick={() => recordGoal(PLAYER.HOME_STRIKER)}>
      Marcar gol
    </button>
  )
}

const meta = {
  title: 'Live/ToastStack',
  component: ToastStack,
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'evento-1' } })
  },
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <div style={{ height: 320 }}>
          <RecordGoalButton />
          <Story />
        </div>
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof ToastStack>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('status')).not.toBeInTheDocument()
  },
}

export const AfterGoal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Marcar gol' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('GOL MARCADO')
  },
}
