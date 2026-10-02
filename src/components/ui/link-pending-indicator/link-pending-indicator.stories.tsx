import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Link from 'next/link'
import { expect, within } from 'storybook/test'
import { LinkPendingIndicator } from './link-pending-indicator'

const meta = {
  title: 'UI/LinkPendingIndicator',
  component: LinkPendingIndicator,
  decorators: [
    (Story) => (
      <Link href="/campeonatos">
        Campeonatos
        <Story />
      </Link>
    ),
  ],
} satisfies Meta<typeof LinkPendingIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const IdleLink: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Campeonatos' })).toBeInTheDocument()
    await expect(within(canvasElement.ownerDocument.body).queryByRole('progressbar')).not.toBeInTheDocument()
  },
}
