import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RowsSkeleton } from './rows-skeleton'

const meta = {
  title: 'History/RowsSkeleton',
  component: RowsSkeleton,
  args: { rowCount: 5, titleWidthClass: 'w-[210px]' },
} satisfies Meta<typeof RowsSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
