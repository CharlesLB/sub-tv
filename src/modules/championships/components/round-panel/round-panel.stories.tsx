import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FIRST_PHASE_FIXTURE, SEASON_ID_FIXTURE } from '../match-card/match-card.fixtures'
import { RoundPanel } from './round-panel'
import { seasonMatchesFixture } from './round-panel.fixtures'
import { RoundPanelSkeleton } from './round-panel.skeleton'

const meta = {
  title: 'Championships/RoundPanel',
  component: RoundPanel,
  args: { seasonId: SEASON_ID_FIXTURE, matches: seasonMatchesFixture, currentRound: 3, currentPhase: FIRST_PHASE_FIXTURE },
} satisfies Meta<typeof RoundPanel>

export default meta

type Story = StoryObj<typeof meta>

export const CurrentRound: Story = {}

export const WithoutMatchesInRound: Story = { args: { matches: [], currentRound: null, currentPhase: null } }

export const Loading: Story = { render: () => <RoundPanelSkeleton /> }
