import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { homeTeamFixture } from '../scoreboard-team/scoreboard-team.fixtures'
import { MARKS_VARIANT, PlayerMarks } from './player-marks'
import { busyMatchStateFixture, directRedMatchStateFixture, secondYellowMatchStateFixture, subbedOutMatchStateFixture } from './player-marks.fixtures'

const meta = {
  title: 'Live/PlayerMarks',
  component: PlayerMarks,
  args: { state: busyMatchStateFixture, variant: MARKS_VARIANT.PITCH },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 56, height: 56, margin: 24, borderRadius: '50%', background: homeTeamFixture.color }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerMarks>

export default meta

type Story = StoryObj<typeof meta>

export const GoalsAssistsAndYellow: Story = {}

export const OnBench: Story = { args: { variant: MARKS_VARIANT.BENCH } }

export const DirectRed: Story = { args: { state: directRedMatchStateFixture } }

export const SecondYellow: Story = { args: { state: secondYellowMatchStateFixture } }

export const SubbedOut: Story = { args: { state: subbedOutMatchStateFixture } }
