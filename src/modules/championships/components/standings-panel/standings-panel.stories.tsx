import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CATEGORY } from '../../categories'
import { StandingsPanel } from './standings-panel'
import { multiplePhasesFixture, singlePhaseFixture } from './standings-panel.fixtures'

const meta = {
  title: 'Championships/StandingsPanel',
  component: StandingsPanel,
  args: { phases: singlePhaseFixture, category: CATEGORY.SUB14, roundsPlayed: 5 },
} satisfies Meta<typeof StandingsPanel>

export default meta

type Story = StoryObj<typeof meta>

export const SinglePhase: Story = {}

export const SeveralPhases: Story = { args: { phases: multiplePhasesFixture, category: CATEGORY.SUB13 } }

export const AfterFirstRound: Story = { args: { roundsPlayed: 1 } }

export const WithoutResults: Story = { args: { phases: [], roundsPlayed: null } }
