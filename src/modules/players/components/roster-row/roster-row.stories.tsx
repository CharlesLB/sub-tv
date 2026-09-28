import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { RosterRow } from './roster-row'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from './roster-row.fixtures'

const meta = {
  title: 'Players/RosterRow',
  component: RosterRow,
  args: { player: squadPlayerFixture, index: 0, href: '/elencos', teamColor: '#1f4fa3', isSelected: false, onSelect: fn() },
  decorators: [
    (Story) => (
      <div style={{ containerType: 'inline-size' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RosterRow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = { args: { isSelected: true } }

export const WithoutDetails: Story = { args: { player: squadPlayerWithoutDetailsFixture } }

export const SelectPlayer: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('link'))
    await expect(args.onSelect).toHaveBeenCalledWith(squadPlayerFixture.id)
  },
}
