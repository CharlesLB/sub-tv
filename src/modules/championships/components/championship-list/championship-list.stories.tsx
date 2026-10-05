import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { EditorAccessProvider } from '@/modules/auth'
import { liveChampionshipFixture } from '../championship-card/championship-card.fixtures'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { ChampionshipList } from './championship-list'
import { championshipsOfYearFixture, SEASON_YEAR_FIXTURE } from './championship-list.fixtures'
import { ChampionshipListSkeleton } from './championship-list.skeleton'

const meta = {
  title: 'Championships/ChampionshipList',
  component: ChampionshipList,
  args: { championships: championshipsOfYearFixture, year: SEASON_YEAR_FIXTURE, clubs: categoryClubsFixture },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChampionshipList>

export default meta

type Story = StoryObj<typeof meta>

export const ReadOnly: Story = {}

export const EmptyCategory: Story = { args: { championships: [liveChampionshipFixture] } }

export const Editor: Story = {
  decorators: [
    (Story) => (
      <EditorAccessProvider canEdit>
        <Story />
      </EditorAccessProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'Novo campeonato SUB-13' }))
    await expect(await canvas.findByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
  },
}

export const Loading: Story = { render: () => <ChampionshipListSkeleton /> }
