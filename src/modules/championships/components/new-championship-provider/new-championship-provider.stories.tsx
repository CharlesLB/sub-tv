import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { CATEGORY } from '../../categories'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipButton } from '../new-championship-button/new-championship-button'
import { NewChampionshipProvider } from './new-championship-provider'

const meta = {
  title: 'Championships/NewChampionshipProvider',
  component: NewChampionshipProvider,
  args: {
    year: 2025,
    clubs: categoryClubsFixture,
    children: (
      <>
        <NewChampionshipButton category={CATEGORY.SUB13} />
        <NewChampionshipButton category={CATEGORY.SUB14} />
      </>
    ),
  },
} satisfies Meta<typeof NewChampionshipProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const OpenedFromLauncher: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Novo campeonato SUB-14' }))
    await expect(await canvas.findByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'true')
  },
}
