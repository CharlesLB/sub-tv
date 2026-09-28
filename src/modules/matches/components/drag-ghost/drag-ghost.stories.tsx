import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { DragGhost } from './drag-ghost'

const meta = {
  title: 'Matches/DragGhost',
  component: DragGhost,
  args: { shirtNumber: 12, name: 'Otávio', color: '#1f4fa3', left: 160, top: 160 },
} satisfies Meta<typeof DragGhost>

export default meta

type Story = StoryObj<typeof meta>

export const FollowingPointer: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement.ownerDocument.body).getByText('Otávio')).toBeInTheDocument()
  },
}
