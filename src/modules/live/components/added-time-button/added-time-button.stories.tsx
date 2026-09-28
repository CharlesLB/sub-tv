import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AddedTimeButton } from './added-time-button'

const meta = {
  title: 'Live/AddedTimeButton',
  component: AddedTimeButton,
  args: { onAdd: fn() },
} satisfies Meta<typeof AddedTimeButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Acréscimo' }))
    await expect(args.onAdd).toHaveBeenCalledTimes(1)
  },
}
