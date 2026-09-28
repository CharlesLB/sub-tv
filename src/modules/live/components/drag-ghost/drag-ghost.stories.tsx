import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { homeReserveFixture, homeTeamFixture } from '../live-board/live-board.fixtures'
import { DragGhost } from './drag-ghost'

const meta = {
  title: 'Live/DragGhost',
  component: DragGhost,
  args: { player: homeReserveFixture, teamColor: homeTeamFixture.color, clientX: 160, clientY: 120, hasTarget: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement.ownerDocument.body).getByText('Caio Brandão')).toBeInTheDocument()
  },
} satisfies Meta<typeof DragGhost>

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTarget: Story = {}

export const OverTarget: Story = { args: { hasTarget: true } }
