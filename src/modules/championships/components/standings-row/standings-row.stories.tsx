import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { CATEGORY } from '../../categories'
import { StandingsRow } from './standings-row'
import { bottomRowFixture, leaderRowFixture, middleRowFixture } from './standings-row.fixtures'

const meta = {
  title: 'Championships/StandingsRow',
  component: StandingsRow,
  args: { row: leaderRowFixture, index: 0, groupSize: 6, category: CATEGORY.SUB14 },
} satisfies Meta<typeof StandingsRow>

export default meta

type Story = StoryObj<typeof meta>

export const Leader: Story = {}

export const MiddleOfTable: Story = { args: { row: middleRowFixture, index: 4, groupSize: 10 } }

export const Bottom: Story = { args: { row: bottomRowFixture, index: 5 } }

export const SquadOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('Vale Verde EC'))
    await expect(canvas.getByText('Vale Verde EC').closest('details')).toHaveAttribute('open')
  },
}
