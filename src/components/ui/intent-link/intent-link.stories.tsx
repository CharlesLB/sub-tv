import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { IntentLink } from './intent-link'

const meta = {
  title: 'UI/IntentLink',
  component: IntentLink,
  args: { href: '/campeonatos', children: 'Campeonatos' },
} satisfies Meta<typeof IntentLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hovered: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Campeonatos' })

    await userEvent.hover(link)

    await expect(link).toHaveAttribute('href', '/campeonatos')
  },
}
