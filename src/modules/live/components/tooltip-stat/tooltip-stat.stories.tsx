import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TooltipStat } from './tooltip-stat'

const meta = {
  title: 'Live/TooltipStat',
  component: TooltipStat,
  args: { label: 'Gols', value: 3, highlightClass: 'text-ac' },
} satisfies Meta<typeof TooltipStat>

export default meta

type Story = StoryObj<typeof meta>

export const Highlighted: Story = {}

export const Zero: Story = { args: { value: 0 } }

export const WithoutHighlight: Story = { args: { label: 'Jogos', value: 9, highlightClass: null } }
