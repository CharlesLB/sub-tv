import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { ChampionshipTabs } from './championship-tabs'
import { ChampionshipTabsSkeleton } from './championship-tabs.skeleton'

const meta = {
  title: 'Championships/ChampionshipTabs',
  component: ChampionshipTabs,
  args: { seasonId: SEASON_ID_FIXTURE },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipTabs>

export default meta

type Story = StoryObj<typeof meta>

const withTab = (tab: string) => ({ nextjs: { navigation: { pathname: `/campeonatos/${SEASON_ID_FIXTURE}`, query: { aba: tab } } } })

export const StandingsActive: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Classificação e rodada' })).toHaveAttribute('aria-current', 'page')
  },
}

export const StatisticsActive: Story = {
  parameters: withTab(CHAMPIONSHIP_TAB.STATISTICS),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Estatísticas' })).toHaveAttribute('aria-current', 'page')
  },
}

export const MatchesActive: Story = {
  parameters: withTab(CHAMPIONSHIP_TAB.MATCHES),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Partidas' })).toHaveAttribute('aria-current', 'page')
  },
}

export const Loading: Story = { render: () => <ChampionshipTabsSkeleton /> }
