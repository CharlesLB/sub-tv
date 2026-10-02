import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, waitFor } from 'storybook/test'
import { SquadsSeasonRedirect } from './squads-season-redirect'

const meta = {
  title: 'Players/SquadsSeasonRedirect',
  component: SquadsSeasonRedirect,
  args: { knownYears: [2026, 2025], fallbackYear: 2026, query: { category: undefined, teamKey: undefined, playerId: undefined } },
  parameters: { nextjs: { navigation: { pathname: '/elencos' } } },
} satisfies Meta<typeof SquadsSeasonRedirect>

export default meta

type Story = StoryObj<typeof meta>

export const LatestSeason: Story = {
  play: async () => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/elencos/2026'))
  },
}
