import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ScrollArrow } from './scroll-arrow'

const meta = {
  title: 'Live/ScrollArrow',
  component: ScrollArrow,
  args: { direction: 'next', isDisabled: false, onClick: fn() },
} satisfies Meta<typeof ScrollArrow>

export default meta

type Story = StoryObj<typeof meta>

export const Next: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Próximos eventos' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const PreviousAtEdge: Story = {
  args: { direction: 'previous', isDisabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Eventos anteriores' })).toBeDisabled()
  },
}
