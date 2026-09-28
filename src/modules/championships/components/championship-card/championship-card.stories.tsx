import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChampionshipCard } from './championship-card'
import { championshipWithNextMatchFixture, championshipWithoutResultsFixture, finishedChampionshipFixture, liveChampionshipFixture } from './championship-card.fixtures'

const meta = {
  title: 'Championships/ChampionshipCard',
  component: ChampionshipCard,
  args: { championship: championshipWithNextMatchFixture, index: 0 },
} satisfies Meta<typeof ChampionshipCard>

export default meta

type Story = StoryObj<typeof meta>

export const WithNextMatch: Story = {}

export const LiveMatch: Story = { args: { championship: liveChampionshipFixture } }

export const Finished: Story = { args: { championship: finishedChampionshipFixture } }

export const WithoutResults: Story = { args: { championship: championshipWithoutResultsFixture } }
