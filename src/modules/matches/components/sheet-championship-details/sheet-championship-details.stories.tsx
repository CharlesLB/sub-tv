import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getChampionshipHeader } from '@/modules/championships'
import { SheetChampionshipDetails } from './sheet-championship-details'
import { championshipHeaderFixture } from './sheet-championship-details.fixtures'

const meta = {
  title: 'Matches/SheetChampionshipDetails',
  component: SheetChampionshipDetails,
  args: { seasonId: championshipHeaderFixture.id },
  beforeEach: () => {
    mocked(getChampionshipHeader).mockResolvedValue(championshipHeaderFixture)
  },
} satisfies Meta<typeof SheetChampionshipDetails>

export default meta

type Story = StoryObj<typeof meta>

export const WithHeader: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Campeonato Mineiro Sub-14')).toBeInTheDocument()
  },
}
