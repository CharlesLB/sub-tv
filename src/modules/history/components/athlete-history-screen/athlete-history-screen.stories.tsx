import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { routes } from '@/lib/routes'
import { ContextBar } from '@/modules/platform'
import { getAthleteHistory } from '../../data/get-athlete-history'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { athleteHistoryFixture } from '../athlete-hero/athlete-hero.fixtures'
import { AthleteHistoryScreen } from './athlete-history-screen'
import { loadedHistoryFilterFixture } from './athlete-history-screen.fixtures'
import { AthleteHistoryScreenSkeleton } from './athlete-history-screen.skeleton'

const meta = {
  title: 'History/AthleteHistoryScreen',
  component: AthleteHistoryScreen,
  args: { playerId: athleteHistoryFixture.playerId, query: {} },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    mocked(getAthleteHistory).mockResolvedValue(athleteHistoryFixture)
  },
} satisfies Meta<typeof AthleteHistoryScreen>

export default meta

type Story = StoryObj<typeof meta>

export const WithSeasons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('heading', { level: 1, name: 'Lucas Andrade' })).toBeInTheDocument()
    await expect(canvas.getByText('Gols por temporada')).toBeInTheDocument()
  },
}

export const WithoutGamesInFilter: Story = {
  beforeEach: () => {
    mocked(getAthleteHistory).mockResolvedValue({ ...athleteHistoryFixture, seasons: [], bestSeason: null })
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Este atleta não tem jogos registrados nas temporadas selecionadas')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  render: () => (
    <>
      <ContextBar crumbs={[{ label: 'Histórico', href: routes.history() }, { label: 'Atleta' }]} title="Ficha do atleta" />
      <AthleteHistoryScreenSkeleton />
    </>
  ),
}
