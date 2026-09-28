import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MENU_MARKER, MenuAction } from './menu-action'

const meta = {
  title: 'Live/MenuAction',
  component: MenuAction,
  args: { label: 'Gol', meta: 'G', colorClass: 'bg-ac', marker: MENU_MARKER.ROUND, shortcut: 'G', onSelect: fn() },
  decorators: [
    (Story) => (
      <div role="menu" aria-label="Ações do jogador" style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuAction>

export default meta

type Story = StoryObj<typeof meta>

export const RoundMarker: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('menuitem', { name: /^Gol/ }))
    await expect(args.onSelect).toHaveBeenCalledTimes(1)
  },
}

export const CardMarker: Story = { args: { label: 'Cartão', meta: 'C', colorClass: 'bg-am', marker: MENU_MARKER.CARD, shortcut: 'C' } }
