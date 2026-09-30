import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { seasonTeamsFixture, secondSeasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { SelectedTeamCategory } from './selected-team-category'

const meta = {
  title: 'Teams/SelectedTeamCategory',
  component: SelectedTeamCategory,
  args: { teams: seasonTeamsFixture },
} satisfies Meta<typeof SelectedTeamCategory>

export default meta

type Story = StoryObj<typeof meta>

export const FirstTeam: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('SUB-14')).toBeInTheDocument()
  },
}

export const TeamFromAddress: Story = {
  parameters: { nextjs: { navigation: { pathname: '/elencos/2025', query: { time: secondSeasonTeamFixture.key } } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('SUB-13')).toBeInTheDocument()
  },
}

export const NoTeam: Story = { args: { teams: [] } }
