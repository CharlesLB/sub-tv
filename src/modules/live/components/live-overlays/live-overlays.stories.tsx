import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { recordLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { useLiveCommands } from '../../state/use-live-commands'
import { strikerMenuFixture } from '../action-menu/action-menu.fixtures'
import { makeBoardInteractions } from '../bench-column/bench-column.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { LiveOverlays } from './live-overlays'
import { benchDragFixture, strikerHoverFixture } from './live-overlays.fixtures'

const OpenCardPicker = () => {
  const { openCardPicker } = useLiveCommands()

  useEffect(() => {
    openCardPicker()
  }, [openCardPicker])

  return null
}

const meta = {
  title: 'Live/LiveOverlays',
  component: LiveOverlays,
  args: { interactions: makeBoardInteractions() },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(recordLiveEvent).mockResolvedValue({ ok: true, data: { id: 'event-1' } })

    return silenceLiveStream()
  },
  decorators: [
    (Story) => (
      <LiveMatchProvider snapshot={liveSnapshotFixture}>
        <Story />
      </LiveMatchProvider>
    ),
  ],
} satisfies Meta<typeof LiveOverlays>

export default meta

type Story = StoryObj<typeof meta>

export const ActionMenuOpen: Story = {
  args: { interactions: makeBoardInteractions({ menu: strikerMenuFixture }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('menu', { name: 'Ações para camisa 9' })).toBeInTheDocument()
  },
}

export const TooltipOnHover: Story = {
  args: { interactions: makeBoardInteractions({ hover: strikerHoverFixture }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('tooltip')).toHaveTextContent('Davi Moreira')
  },
}

export const DraggingReserve: Story = {
  args: { interactions: makeBoardInteractions({ drag: benchDragFixture }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Caio Brandão')).toBeInTheDocument()
  },
}

export const CardPickerOpen: Story = {
  decorators: [
    (Story) => (
      <>
        <OpenCardPicker />
        <Story />
      </>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'Amarelo' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('AMARELO')
  },
}
