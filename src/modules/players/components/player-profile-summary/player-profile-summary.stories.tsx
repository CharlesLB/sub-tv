import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '@/modules/championships/client'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { PlayerProfileSummary } from './player-profile-summary'

const meta = {
  title: 'Players/PlayerProfileSummary',
  component: PlayerProfileSummary,
  args: { player: squadPlayerFixture, teamName: 'Estrela do Vale', category: CATEGORY.SUB14 },
} satisfies Meta<typeof PlayerProfileSummary>

export default meta

type Story = StoryObj<typeof meta>

export const WithDisplayName: Story = {}

export const WithoutDisplayName: Story = { args: { player: squadPlayerWithoutDetailsFixture } }
