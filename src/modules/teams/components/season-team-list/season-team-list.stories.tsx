import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { seasonTeamsFixture, secondSeasonTeamFixture } from '../team-list-item/team-list-item.fixtures'
import { SeasonTeamList } from './season-team-list'

const meta = {
  title: 'Teams/SeasonTeamList',
  component: SeasonTeamList,
  args: { teams: seasonTeamsFixture, year: 2025 },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SeasonTeamList>

export default meta

type Story = StoryObj<typeof meta>

export const FirstTeamSelected: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: /Estrela do Vale/ })).toHaveAttribute('aria-current', 'true')
  },
}

export const TeamFromAddress: Story = {
  parameters: { nextjs: { navigation: { pathname: '/elencos/2025', query: { time: secondSeasonTeamFixture.key } } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: /Serra Azul FC/ })).toHaveAttribute('aria-current', 'true')
  },
}

export const FilteredCategory: Story = {
  parameters: { nextjs: { navigation: { pathname: '/elencos/2025', query: { cat: CATEGORY.SUB13 } } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link', { name: /Estrela do Vale/ })).not.toBeInTheDocument()
  },
}
