import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ACTIVE_YEAR_FIXTURE, championshipsHrefForYear, seasonYearsFixture } from '../season-panel/season-panel.fixtures'
import { YearAxis } from './year-axis'

const meta = {
  title: 'Platform/YearAxis',
  component: YearAxis,
  args: { years: seasonYearsFixture, activeYear: ACTIVE_YEAR_FIXTURE, hrefForYear: championshipsHrefForYear, onSelectYear: fn() },
} satisfies Meta<typeof YearAxis>

export default meta

type Story = StoryObj<typeof meta>

export const LatestSeason: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: '2025' })).toHaveAttribute('aria-current', 'true')
  },
}

export const OlderSeason: Story = { args: { activeYear: 2021 } }

export const FewSeasons: Story = { args: { years: seasonYearsFixture.slice(0, 2) } }

export const BrowsingBack: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Anos anteriores' }))
    await expect(await canvas.findByRole('button', { name: 'Anos seguintes' })).toBeInTheDocument()
  },
}
