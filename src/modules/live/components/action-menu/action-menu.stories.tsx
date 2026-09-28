import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, mocked, userEvent, within } from 'storybook/test'
import { recordLiveEvent } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { starterMatchStateFixture } from '../bench-dot/bench-dot.fixtures'
import { liveSnapshotFixture, silenceLiveStream } from '../live-board/live-board.fixtures'
import { ActionMenu } from './action-menu'
import { sentOffStrikerFixture, strikerMenuFixture, strikerWithNumbersFixture } from './action-menu.fixtures'

const meta = {
  title: 'Live/ActionMenu',
  component: ActionMenu,
  args: { menu: strikerMenuFixture, matchState: starterMatchStateFixture, onClose: fn() },
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
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('menuitem', { name: /^Gol/ })).toHaveFocus()
    await userEvent.click(canvas.getByRole('menuitem', { name: /^Gol/ }))
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const WithMatchNumbers: Story = {
  args: { matchState: strikerWithNumbersFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('menuitem', { name: /^Gol/ })).toHaveTextContent('Gol+2')
  },
}

export const SentOff: Story = {
  args: { matchState: sentOffStrikerFixture },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('menuitem', { name: /^Cartão vermelho/ })).toHaveTextContent('Expulso')
  },
}
