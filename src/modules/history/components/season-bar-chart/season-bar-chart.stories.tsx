import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { cruzeiroBadgeFixture } from '../accumulated-table/accumulated-table.fixtures'
import { SeasonBarChart } from './season-bar-chart'
import { seasonBarsFixture } from './season-bar-chart.fixtures'
import { SeasonBarChartSkeleton } from './season-bar-chart.skeleton'

const meta = {
  title: 'History/SeasonBarChart',
  component: SeasonBarChart,
  args: { title: 'Gols por temporada', bars: seasonBarsFixture, color: cruzeiroBadgeFixture.color, trackHeightClass: 'h-[88px]' },
} satisfies Meta<typeof SeasonBarChart>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {}

export const Empty: Story = { args: { bars: [] } }

export const Loading: Story = { render: () => <SeasonBarChartSkeleton barCount={seasonBarsFixture.length} trackHeightClass="h-[88px]" /> }
