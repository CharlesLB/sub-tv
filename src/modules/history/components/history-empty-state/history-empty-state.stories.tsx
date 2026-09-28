import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryEmptyState } from './history-empty-state'

const meta = {
  title: 'History/HistoryEmptyState',
  component: HistoryEmptyState,
  args: { message: 'Nenhum gol registrado para os filtros selecionados' },
} satisfies Meta<typeof HistoryEmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
