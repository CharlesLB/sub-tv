import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HistoryEmptyState } from '../history-empty-state/history-empty-state'
import { HistoryFrame } from './history-frame'

const meta = {
  title: 'History/HistoryFrame',
  component: HistoryFrame,
  args: { children: <HistoryEmptyState message="Conteúdo do histórico" /> },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HistoryFrame>

export default meta

type Story = StoryObj<typeof meta>

export const WithContent: Story = {}
