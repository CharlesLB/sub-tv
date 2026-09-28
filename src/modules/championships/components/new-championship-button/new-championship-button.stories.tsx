import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { CATEGORY } from '../../categories'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipProvider } from '../new-championship-provider/new-championship-provider'
import { NewChampionshipButton } from './new-championship-button'

const withNewChampionshipProvider: Decorator = (Story) => (
  <NewChampionshipProvider year={2025} clubs={categoryClubsFixture}>
    <Story />
  </NewChampionshipProvider>
)

const meta = {
  title: 'Championships/NewChampionshipButton',
  component: NewChampionshipButton,
  args: { category: CATEGORY.SUB13 },
  decorators: [withNewChampionshipProvider],
} satisfies Meta<typeof NewChampionshipButton>

export default meta

type Story = StoryObj<typeof meta>

export const Sub13: Story = {}

export const OpensForm: Story = {
  args: { category: CATEGORY.SUB14 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Novo campeonato SUB-14' }))
    await expect(await canvas.findByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
  },
}
