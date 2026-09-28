import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { CATEGORY } from '@/modules/championships/client'
import { updatePlayerProfile } from '../../actions/player-actions'
import { squadPlayerFixture, squadPlayerWithoutDetailsFixture } from '../roster-row/roster-row.fixtures'
import { PlayerProfileForm } from './player-profile-form'

const meta = {
  title: 'Players/PlayerProfileForm',
  component: PlayerProfileForm,
  args: { player: squadPlayerFixture, teamName: 'Estrela do Vale', category: CATEGORY.SUB14 },
} satisfies Meta<typeof PlayerProfileForm>

export default meta

type Story = StoryObj<typeof meta>

export const Filled: Story = {}

export const EmptyProfile: Story = { args: { player: squadPlayerWithoutDetailsFixture } }

export const SavedPosition: Story = {
  beforeEach: () => {
    mocked(updatePlayerProfile).mockResolvedValue({ ok: true, data: { playerId: squadPlayerFixture.id } })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Atacante' }))
    await expect(await canvas.findByText('Salvo')).toBeInTheDocument()
  },
}

export const RejectedDisplayName: Story = {
  beforeEach: () => {
    mocked(updatePlayerProfile).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { displayName: ['Use no máximo 30 caracteres.'] } })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox', { name: 'Apelido (como o narrador chama)' }), ' da Vila')
    await userEvent.tab()
    await expect(await canvas.findByText('Use no máximo 30 caracteres.')).toBeInTheDocument()
  },
}
