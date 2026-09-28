import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WizardToast } from './wizard-toast'

const meta = {
  title: 'Matches/WizardToast',
  component: WizardToast,
  args: { message: 'Não foi possível criar a partida · Tente novamente em instantes.', onClose: fn() },
} satisfies Meta<typeof WizardToast>

export default meta

type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Fechar notificação' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}

export const TitleOnly: Story = { args: { message: 'Sem conexão com o servidor' } }
