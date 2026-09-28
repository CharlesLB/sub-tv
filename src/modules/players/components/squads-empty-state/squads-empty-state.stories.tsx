import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SquadsEmptyState } from './squads-empty-state'

const meta = {
  title: 'Players/SquadsEmptyState',
  component: SquadsEmptyState,
  args: { title: 'Nenhum elenco em 2025 ainda', description: 'Os elencos aparecem assim que as súmulas desta temporada forem importadas da FMF.' },
} satisfies Meta<typeof SquadsEmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
