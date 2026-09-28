import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistorySection } from './history-section'

const meta = {
  title: 'History/HistorySection',
  component: HistorySection,
  args: { title: 'Artilheiros do time', children: <HistoryEmptyState message="Nenhum gol do time nos filtros selecionados" /> },
} satisfies Meta<typeof HistorySection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
