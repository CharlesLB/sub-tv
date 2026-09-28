import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormSquares } from './form-squares'

const meta = {
  title: 'History/FormSquares',
  component: FormSquares,
  args: { form: ['V', 'E', 'D', 'V', 'V'] },
} satisfies Meta<typeof FormSquares>

export default meta

type Story = StoryObj<typeof meta>

export const MixedResults: Story = {}

export const Empty: Story = { args: { form: [] } }
