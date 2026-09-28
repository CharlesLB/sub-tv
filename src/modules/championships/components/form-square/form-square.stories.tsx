import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormSquare } from './form-square'
import { FORM_RESULT } from './form-square.fixtures'

const meta = {
  title: 'Championships/FormSquare',
  component: FormSquare,
  args: { result: FORM_RESULT.WIN },
} satisfies Meta<typeof FormSquare>

export default meta

type Story = StoryObj<typeof meta>

export const Win: Story = {}

export const Draw: Story = { args: { result: FORM_RESULT.DRAW } }

export const Loss: Story = { args: { result: FORM_RESULT.LOSS } }

export const Small: Story = { args: { size: 'small' } }
