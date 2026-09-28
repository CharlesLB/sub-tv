import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { LineupsStep } from './lineups-step'
import { lineupSidesFixture } from './lineups-step.fixtures'

const meta = {
  title: 'Matches/LineupsStep',
  component: LineupsStep,
  args: { sides: lineupSidesFixture, category: CATEGORY.SUB14, year: 2026, onToggle: fn() },
} satisfies Meta<typeof LineupsStep>

export default meta

type Story = StoryObj<typeof meta>

export const BothSides: Story = {
  play: async ({ args, canvasElement }) => {
    const awayCard = within(within(canvasElement).getByRole('region', { name: 'Escalação Atlético Serrano' }))

    await userEvent.click(awayCard.getByRole('checkbox', { name: /Isaque Farias/ }))
    await expect(args.onToggle).toHaveBeenCalledWith('away', 'serrano-13')
  },
}
