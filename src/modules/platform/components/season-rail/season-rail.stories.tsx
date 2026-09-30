import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { activeChampionshipIdFixture, championshipRibbonFixture } from '../championship-ribbon/championship-ribbon.fixtures'
import { ACTIVE_YEAR_FIXTURE, seasonYearsFixture } from '../season-panel/season-panel.fixtures'
import { SeasonRail } from './season-rail'
import { SeasonRailSkeleton } from './season-rail.skeleton'

const meta = {
  title: 'Platform/SeasonRail',
  component: SeasonRail,
  args: { years: seasonYearsFixture, activeYear: ACTIVE_YEAR_FIXTURE, championships: championshipRibbonFixture, basePath: '/campeonatos' },
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/campeonatos', query: { temporada: String(ACTIVE_YEAR_FIXTURE) } } } },
} satisfies Meta<typeof SeasonRail>

export default meta

type Story = StoryObj<typeof meta>

export const Championships: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: '2025' })).toHaveAttribute('href', '/campeonatos?temporada=2025')
  },
}

export const InsideChampionship: Story = {
  args: { activeChampionshipId: activeChampionshipIdFixture },
  parameters: { nextjs: { navigation: { pathname: `/campeonatos/${activeChampionshipIdFixture}`, query: {} } } },
}

export const Squads: Story = {
  args: { basePath: '/elencos' },
  parameters: { nextjs: { navigation: { pathname: `/elencos/${ACTIVE_YEAR_FIXTURE}`, query: { cat: 'sub13' } } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: '2025' })).toHaveAttribute('href', '/elencos/2025?cat=sub13')
  },
}

export const Loading: Story = { render: () => <SeasonRailSkeleton /> }
