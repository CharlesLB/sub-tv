import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { ContextBar } from '@/modules/platform'
import { getHistoryOverview } from '../../data/get-history-overview'
import { loadHistoryFilter } from '../../data/load-history-filter'
import { loadedHistoryFilterFixture } from '../athlete-history-screen/athlete-history-screen.fixtures'
import { emptyHistoryOverviewFixture, historyOverviewFixture } from '../highlight-cards/highlight-cards.fixtures'
import { HISTORY_OVERVIEW_TITLE, HistoryOverviewScreen } from './history-overview-screen'
import { HistoryOverviewScreenSkeleton } from './history-overview-screen.skeleton'

const meta = {
  title: 'History/HistoryOverviewScreen',
  component: HistoryOverviewScreen,
  args: { query: {} },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(loadHistoryFilter).mockResolvedValue(loadedHistoryFilterFixture)
    mocked(getHistoryOverview).mockResolvedValue(historyOverviewFixture)
  },
} satisfies Meta<typeof HistoryOverviewScreen>

export default meta

type Story = StoryObj<typeof meta>

export const WithData: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('heading', { level: 1, name: HISTORY_OVERVIEW_TITLE })).toBeInTheDocument()
    await expect(canvas.getByText('Classificação acumulada por time')).toBeInTheDocument()
  },
}

export const WithoutData: Story = {
  beforeEach: () => {
    mocked(getHistoryOverview).mockResolvedValue(emptyHistoryOverviewFixture)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Nenhuma campanha registrada para os filtros selecionados')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  render: () => (
    <>
      <ContextBar crumbs={[{ label: 'Histórico' }]} title={HISTORY_OVERVIEW_TITLE} />
      <HistoryOverviewScreenSkeleton />
    </>
  ),
}
