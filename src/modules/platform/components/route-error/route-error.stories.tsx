import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { RouteError } from './route-error'

const meta = {
  title: 'Platform/RouteError',
  component: RouteError,
  args: { retry: fn() },
} satisfies Meta<typeof RouteError>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Tentar de novo' }))
    await expect(args.retry).toHaveBeenCalledOnce()
  },
}

export const CustomMessage: Story = { args: { title: 'Partida indisponível', description: 'Volte à lista de partidas.' } }
