import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { HistoryFilters } from './history-filters'

const meta = {
  title: 'History/HistoryFilters',
  component: HistoryFilters,
  args: { filter: loadedHistoryFilterFixture.filter, availableYears: loadedHistoryFilterFixture.availableYears, target: { kind: 'overview' } },
} satisfies Meta<typeof HistoryFilters>

export default meta

type Story = StoryObj<typeof meta>

export const SelectedSeasons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('link', { name: '2024' })).toHaveAttribute('aria-current', 'true')
    await expect(canvas.getByRole('link', { name: '2023' })).not.toHaveAttribute('aria-current')
  },
}

export const AllSeasons: Story = { args: { filter: { category: null, years: [] } } }

export const SelectedCategory: Story = {
  args: { filter: { category: CATEGORY.SUB14, years: [] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'SUB-14' })).toHaveAttribute('aria-current', 'true')
  },
}
