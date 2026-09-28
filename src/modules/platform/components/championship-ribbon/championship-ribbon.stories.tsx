import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ChampionshipRibbon } from './championship-ribbon'
import { activeChampionshipIdFixture, championshipRibbonFixture } from './championship-ribbon.fixtures'

const NARROW_RAIL_WIDTH = 420

const withNarrowRail: Decorator = (Story) => (
  <div style={{ display: 'flex', alignItems: 'center', width: NARROW_RAIL_WIDTH }}>
    <Story />
  </div>
)

const meta = {
  title: 'Platform/ChampionshipRibbon',
  component: ChampionshipRibbon,
  args: { championships: championshipRibbonFixture, activeChampionshipId: activeChampionshipIdFixture },
} satisfies Meta<typeof ChampionshipRibbon>

export default meta

type Story = StoryObj<typeof meta>

export const WithActiveChampionship: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: /Mineiro Sub-14/ })).toHaveAttribute('aria-current', 'page')
  },
}

export const WithoutActiveChampionship: Story = { args: { activeChampionshipId: null } }

export const Overflowing: Story = {
  decorators: [withNarrowRail],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'Mais campeonatos' }))
    await expect(await canvas.findByRole('button', { name: 'Campeonatos anteriores' })).toBeInTheDocument()
  },
}
