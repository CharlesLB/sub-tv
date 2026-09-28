import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CARD_COLOR } from '../../state/live-actions'
import { CardPicker } from './card-picker'

const meta = {
  title: 'Live/CardPicker',
  component: CardPicker,
  args: { onPick: fn(), onCancel: fn() },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CardPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Amarelo' })).toHaveFocus()
  },
}

export const PickRed: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Vermelho' }))
    await expect(args.onPick).toHaveBeenCalledWith(CARD_COLOR.RED)
  },
}

export const Cancel: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Cancelar (esc)' }))
    await expect(args.onCancel).toHaveBeenCalledTimes(1)
  },
}
