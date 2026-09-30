import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LINEUP_VIEW } from '../../lib/wizard-reducer/wizard-reducer'
import { LineupViewToolbar } from './lineup-view-toolbar'

const meta = {
  title: 'Matches/LineupViewToolbar',
  component: LineupViewToolbar,
  args: { view: LINEUP_VIEW.LIST, onChange: fn() },
} satisfies Meta<typeof LineupViewToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const ListView: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Campo' }))
    await expect(args.onChange).toHaveBeenCalledWith(LINEUP_VIEW.FIELD)
  },
}

export const FieldView: Story = { args: { view: LINEUP_VIEW.FIELD } }
