import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getMatchSetup } from '../../data/get-match-setup'
import { matchSetupFixture, prefilledMatchSetupFixture } from '../new-match-wizard/new-match-wizard.fixtures'
import { NewMatchSetup } from './new-match-setup'

const meta = {
  title: 'Matches/NewMatchSetup',
  component: NewMatchSetup,
  args: { seasonId: matchSetupFixture.championship.id, prefillMatchId: null, presentation: 'page' },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(getMatchSetup).mockResolvedValue(matchSetupFixture)
  },
} satisfies Meta<typeof NewMatchSetup>

export default meta

type Story = StoryObj<typeof meta>

export const NewMatch: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('navigation', { name: 'Etapas da nova partida' })).toBeInTheDocument()
  },
}

export const PrefilledMatch: Story = {
  args: { prefillMatchId: prefilledMatchSetupFixture.prefill?.matchId ?? null },
  beforeEach: () => {
    mocked(getMatchSetup).mockResolvedValue(prefilledMatchSetupFixture)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByDisplayValue('Arena do Vale · campo 2')).toBeInTheDocument()
  },
}
