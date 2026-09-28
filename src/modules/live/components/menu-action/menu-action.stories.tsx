import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MENU_MARKER, MenuAction } from './menu-action'

const meta = {
  title: 'Live/MenuAction',
  component: MenuAction,
  args: { label: 'Gol', meta: '+2', colorClass: 'bg-ac', marker: MENU_MARKER.ROUND, onSelect: fn() },
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
  args: { shortcut: 'G' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('menuitem', { name: 'Gol, +2' }))
    await expect(args.onSelect).toHaveBeenCalledTimes(1)
  },
}

export const CardMarker: Story = {
  args: { label: 'Cartão vermelho', meta: 'Expulso', colorClass: 'bg-vm', marker: MENU_MARKER.CARD },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('menuitem', { name: 'Cartão vermelho, Expulso' })).not.toHaveAttribute('aria-keyshortcuts')
  },
}
