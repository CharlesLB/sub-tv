import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { CategoryFilter } from './category-filter'

const meta = {
  title: 'Teams/CategoryFilter',
  component: CategoryFilter,
  args: { year: 2025, activeCategory: undefined, activeTeamKey: seasonTeamFixture.key },
} satisfies Meta<typeof CategoryFilter>

export default meta

type Story = StoryObj<typeof meta>

export const AllCategories: Story = {}

export const Sub13: Story = { args: { activeCategory: CATEGORY.SUB13 } }

export const Sub14: Story = { args: { activeCategory: CATEGORY.SUB14 } }
