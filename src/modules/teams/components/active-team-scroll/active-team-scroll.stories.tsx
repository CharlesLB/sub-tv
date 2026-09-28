import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, waitFor } from 'storybook/test'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../constants/active-team'
import { ActiveTeamScroll } from './active-team-scroll'

const TEAM_NAMES = ['Estrela do Vale', 'Serra Azul FC', 'Atlético Ribeirinho', 'Grêmio Cachoeira', 'União Planalto', 'Esporte Clube Aurora']
const ACTIVE_TEAM_NAME = 'Esporte Clube Aurora'

const meta = {
  title: 'Teams/ActiveTeamScroll',
  component: ActiveTeamScroll,
  args: { activeTeamKey: 'sub14-aurora' },
  decorators: [
    (Story) => (
      <section aria-label="Times" style={{ height: 120, overflowY: 'auto' }}>
        {TEAM_NAMES.map((teamName) => (
          <button key={teamName} type="button" style={{ display: 'block', height: 48 }} {...(teamName === ACTIVE_TEAM_NAME ? { [ACTIVE_TEAM_ATTRIBUTE]: true } : {})}>
            {teamName}
          </button>
        ))}
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof ActiveTeamScroll>

export default meta

type Story = StoryObj<typeof meta>

export const ScrollsToActiveTeam: Story = {
  play: async ({ canvas }) => {
    const scroller = canvas.getByRole('region', { name: 'Times' })

    await waitFor(() => expect(scroller.scrollTop).toBeGreaterThan(0))
  },
}

export const WithoutActiveTeam: Story = {
  args: { activeTeamKey: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Times' }).scrollTop).toBe(0)
  },
}
