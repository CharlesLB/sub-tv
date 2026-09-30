import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CHAMPIONSHIP_TAB } from '../../lib/championship-tab/championship-tab'
import { SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { ChampionshipTabs } from './championship-tabs'
import { ChampionshipTabsSkeleton } from './championship-tabs.skeleton'

const meta = {
  title: 'Championships/ChampionshipTabs',
  component: ChampionshipTabs,
  args: { seasonId: SEASON_ID_FIXTURE, activeTab: CHAMPIONSHIP_TAB.STANDINGS },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipTabs>

export default meta

type Story = StoryObj<typeof meta>

export const StandingsActive: Story = {}

export const StatisticsActive: Story = { args: { activeTab: CHAMPIONSHIP_TAB.STATISTICS } }

export const MatchesActive: Story = { args: { activeTab: CHAMPIONSHIP_TAB.MATCHES } }

export const Loading: Story = { render: () => <ChampionshipTabsSkeleton /> }
