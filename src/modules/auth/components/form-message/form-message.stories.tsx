import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { FormMessage } from './form-message'

const meta = {
  title: 'Auth/FormMessage',
  component: FormMessage,
  args: { state: { ok: false, error: 'Confira os campos.' } },
} satisfies Meta<typeof FormMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Failed: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Confira os campos.')
  },
}

export const Success: Story = {
  args: { state: { ok: true, data: undefined }, successMessage: 'Senha redefinida.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Senha redefinida.')
  },
}
