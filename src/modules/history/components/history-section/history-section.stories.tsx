import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from './history-section'
import { HistorySectionSkeleton } from './history-section.skeleton'

const EMPTY_MESSAGE = 'Nenhum gol do time nos filtros selecionados'

const meta = {
  title: 'History/HistorySection',
  component: HistorySection,
  args: { title: 'Artilheiros do time', children: <HistoryEmptyState message={EMPTY_MESSAGE} /> },
} satisfies Meta<typeof HistorySection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  render: () => (
    <HistorySectionSkeleton titleWidthClass="w-[150px]">
      <HistoryEmptyState message={EMPTY_MESSAGE} />
    </HistorySectionSkeleton>
  ),
}
