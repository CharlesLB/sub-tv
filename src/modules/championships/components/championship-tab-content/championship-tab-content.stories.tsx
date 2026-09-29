import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { CHAMPIONSHIP_TAB } from '../../championship-tab'
import { getSeasonMatches } from '../../data/get-season-matches'
import { getStandings } from '../../data/get-standings'
import { getTopScorers } from '../../data/get-top-scorers'
import { seasonMatchesFixture } from '../round-panel/round-panel.fixtures'
import { singlePhaseFixture } from '../standings-panel/standings-panel.fixtures'
import { topScorersFixture } from '../top-scorers-table/top-scorers-table.fixtures'
import { ChampionshipTabContent } from './championship-tab-content'
import { championshipHeaderFixture } from './championship-tab-content.fixtures'
import { ChampionshipDetailSkeleton } from './championship-tab-content.skeleton'

const meta = {
  title: 'Championships/ChampionshipTabContent',
  component: ChampionshipTabContent,
  args: { header: championshipHeaderFixture, tab: CHAMPIONSHIP_TAB.STANDINGS },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(getStandings).mockResolvedValue(singlePhaseFixture)
    mocked(getSeasonMatches).mockResolvedValue(seasonMatchesFixture)
    mocked(getTopScorers).mockResolvedValue(topScorersFixture)
  },
} satisfies Meta<typeof ChampionshipTabContent>

export default meta

type Story = StoryObj<typeof meta>

export const Standings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Após 3 Rodadas')).toBeInTheDocument()
    await expect(canvas.getByText('Rodada 3')).toBeInTheDocument()
  },
}

export const Statistics: Story = {
  args: { tab: CHAMPIONSHIP_TAB.STATISTICS },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Artilharia')).toBeInTheDocument()
  },
}

export const Matches: Story = {
  args: { tab: CHAMPIONSHIP_TAB.MATCHES },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findAllByRole('article')).toHaveLength(seasonMatchesFixture.length)
  },
}

export const Loading: Story = { render: () => <ChampionshipDetailSkeleton /> }
