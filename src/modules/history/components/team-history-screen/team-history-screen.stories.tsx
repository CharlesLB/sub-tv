import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getTeamHistory } from '../../data/get-team-history'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { teamHistoryFixture, teamWithoutSeasonsFixture } from '../team-hero/team-hero.fixtures'
import { TeamHistoryScreen } from './team-history-screen'

const meta = {
  title: 'History/TeamHistoryScreen',
  component: TeamHistoryScreen,
  args: { teamKey: teamHistoryFixture.teamKey, query: {} },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    mocked(getTeamHistory).mockResolvedValue(teamHistoryFixture)
  },
} satisfies Meta<typeof TeamHistoryScreen>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('heading', { level: 1, name: 'Cruzeiro SUB-14' })).toBeInTheDocument()
    await expect(canvas.getByText('Pontos por temporada')).toBeInTheDocument()
  },
}

export const WithoutSeasonsInFilter: Story = {
  beforeEach: () => {
    mocked(getTeamHistory).mockResolvedValue(teamWithoutSeasonsFixture)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Este time não disputou campeonatos nas temporadas selecionadas')).toBeInTheDocument()
  },
}
