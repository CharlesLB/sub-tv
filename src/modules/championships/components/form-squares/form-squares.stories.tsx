import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { recentFormFixture } from '../form-square/form-square.fixtures'
import { FORM_SQUARE_SIZE } from '../form-square/form-square.styles'
import { FormSquares } from './form-squares'

const meta = {
  title: 'Championships/FormSquares',
  component: FormSquares,
  args: { form: recentFormFixture },
} satisfies Meta<typeof FormSquares>

export default meta

type Story = StoryObj<typeof meta>

export const RecentForm: Story = {}

export const Dense: Story = { args: { size: FORM_SQUARE_SIZE.DENSE } }

export const WithoutResults: Story = { args: { form: [] } }
