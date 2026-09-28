import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ToastCard } from './toast-card'
import { goalToastFixture, infoToastFixture, warningToastFixture } from './toast-card.fixtures'

const meta = {
  title: 'Live/ToastCard',
  component: ToastCard,
  args: { toast: goalToastFixture, onUndo: fn(), onDismiss: fn() },
} satisfies Meta<typeof ToastCard>

export default meta

type Story = StoryObj<typeof meta>

export const GoalWithUndo: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Desfazer' }))
    await expect(args.onUndo).toHaveBeenCalledWith(goalToastFixture.id)
  },
}

export const Warning: Story = {
  args: { toast: warningToastFixture },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Fechar notificação' }))
    await expect(args.onDismiss).toHaveBeenCalledWith(warningToastFixture.id)
  },
}

export const Info: Story = { args: { toast: infoToastFixture } }
