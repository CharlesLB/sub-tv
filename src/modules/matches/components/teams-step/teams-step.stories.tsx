import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { awayTeamFixture, homeTeamFixture, thirdTeamFixture } from '../lineup-card/lineup-card.fixtures'
import { TeamsStep } from './teams-step'

const meta = {
  title: 'Matches/TeamsStep',
  component: TeamsStep,
  args: {
    teams: [homeTeamFixture, awayTeamFixture, thirdTeamFixture],
    category: CATEGORY.SUB14,
    chosenTeamIds: { home: homeTeamFixture.seasonTeamId, away: awayTeamFixture.seasonTeamId },
    notice: 'Somente os 3 times inscritos em Mineiro SUB-14 aparecem nesta lista. Times Sub-13 dos mesmos clubes são entidades separadas e não entram aqui.',
    onPick: fn(),
  },
} satisfies Meta<typeof TeamsStep>

export default meta

type Story = StoryObj<typeof meta>

export const BothTeamsChosen: Story = {
  play: async ({ args, canvasElement }) => {
    const awayGroup = within(within(canvasElement).getByRole('group', { name: 'Time visitante' }))

    await userEvent.click(awayGroup.getByRole('button', { name: 'União Mineira' }))
    await expect(args.onPick).toHaveBeenCalledWith('away', thirdTeamFixture)
  },
}

export const WithoutNotice: Story = { args: { notice: null, chosenTeamIds: { home: homeTeamFixture.seasonTeamId, away: null } } }

export const WithoutTeams: Story = { args: { teams: [], chosenTeamIds: { home: null, away: null }, notice: null } }
