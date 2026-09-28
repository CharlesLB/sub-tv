import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { liveChampionshipFixture } from '../championship-card/championship-card.fixtures'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { ChampionshipList } from './championship-list'
import { championshipsOfYearFixture, SEASON_YEAR_FIXTURE } from './championship-list.fixtures'

const meta = {
  title: 'Championships/ChampionshipList',
  component: ChampionshipList,
  args: { championships: championshipsOfYearFixture, year: SEASON_YEAR_FIXTURE, clubs: categoryClubsFixture, canEdit: false },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipList>

export default meta

type Story = StoryObj<typeof meta>

export const ReadOnly: Story = {}

export const EmptyCategory: Story = { args: { championships: [liveChampionshipFixture] } }

export const Editor: Story = {
  args: { canEdit: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Novo campeonato SUB-13' }))
    await expect(await canvas.findByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
  },
}
