import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { FlashToast } from './flash-toast'

const meta = {
  title: 'Championships/FlashToast',
  component: FlashToast,
  args: { message: 'Campeonato criado · SUB-13', tone: 'success', onClose: fn() },
} satisfies Meta<typeof FlashToast>

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Fechar notificação' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}

export const Warning: Story = { args: { message: 'Defina nome e categoria do campeonato', tone: 'warning' } }
