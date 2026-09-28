import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { footLabel } from '../../labels'
import { PREFERRED_FEET } from '../../schemas'
import { SegmentedChoice } from './segmented-choice'

const FOOT_OPTIONS = PREFERRED_FEET.map((foot) => ({ value: foot, label: footLabel[foot] }))

const meta = {
  title: 'Players/SegmentedChoice',
  component: SegmentedChoice,
  args: { name: 'preferredFoot', legend: 'Pé preferido', options: FOOT_OPTIONS, defaultValue: 'canhoto', onChange: fn() },
} satisfies Meta<typeof SegmentedChoice<(typeof PREFERRED_FEET)[number]>>

export default meta

type Story = StoryObj<typeof meta>

export const WithDefault: Story = {}

export const WithoutDefault: Story = { args: { defaultValue: null } }

export const ChangeChoice: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Ambidestro' }))
    await expect(canvas.getByRole('radio', { name: 'Ambidestro' })).toBeChecked()
    await expect(args.onChange).toHaveBeenCalled()
  },
}
