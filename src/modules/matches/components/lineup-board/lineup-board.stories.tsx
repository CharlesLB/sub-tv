import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LineupBoard } from './lineup-board'
import { boardSidesFixture } from './lineup-board.fixtures'

const meta = {
  title: 'Matches/LineupBoard',
  component: LineupBoard,
  args: { sides: boardSidesFixture, categoryLabel: 'SUB-14', dispatch: fn() },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineupBoard>

export default meta

type Story = StoryObj<typeof meta>

export const BothSides: Story = {
  play: async ({ args, canvasElement }) => {
    within(canvasElement)
      .getByRole('button', { name: /Caio Ribeiro, Estrela do Vale/ })
      .focus()

    await userEvent.keyboard('{Delete}')
    await expect(args.dispatch).toHaveBeenCalledWith({ type: 'starter/benched', side: 'home', playerId: 'estrela-1' })
  },
}

export const EmptyPitch: Story = { args: { sides: boardSidesFixture.map((boardSide) => ({ ...boardSide, starterIds: [], positions: {} })) } }
