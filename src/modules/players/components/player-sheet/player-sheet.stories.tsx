import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { secondSquadPlayerFixture, squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { PlayerSheet } from './player-sheet'
import { PlayerSheetSkeleton } from './player-sheet.skeleton'

const meta = {
  title: 'Players/PlayerSheet',
  component: PlayerSheet,
  args: { player: squadPlayerFixture, squad: teamSquadFixture, categoryFilter: undefined, canEdit: false, lastChange: null, onClose: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerSheet>

export default meta

type Story = StoryObj<typeof meta>

export const ReadOnly: Story = {}

export const Editable: Story = { args: { canEdit: true } }

export const OnlyInThisCategory: Story = { args: { player: secondSquadPlayerFixture } }

export const WithoutDetails: Story = { args: { player: squadPlayerWithoutDetailsFixture, canEdit: true } }

export const Loading: Story = { render: () => <PlayerSheetSkeleton /> }
