import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../categories'
import { CategoryTag } from './category-tag'

const meta = {
  title: 'Championships/CategoryTag',
  component: CategoryTag,
  args: { category: CATEGORY.SUB13 },
} satisfies Meta<typeof CategoryTag>

export default meta

type Story = StoryObj<typeof meta>

export const Sub13Small: Story = {}

export const Sub14Medium: Story = { args: { category: CATEGORY.SUB14, size: 'medium' } }

export const Large: Story = { args: { size: 'large' } }

export const ExtraLarge: Story = { args: { category: CATEGORY.SUB14, size: 'extraLarge' } }
