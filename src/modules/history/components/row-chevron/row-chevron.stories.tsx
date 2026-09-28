import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RowChevron } from './row-chevron'

const meta = {
  title: 'History/RowChevron',
  component: RowChevron,
} satisfies Meta<typeof RowChevron>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
