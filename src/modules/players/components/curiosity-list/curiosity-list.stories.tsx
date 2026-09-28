import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { addCuriosity } from '../../actions/player-actions'
import { squadPlayerFixture } from '../roster-row/roster-row.fixtures'
import { CuriosityList } from './curiosity-list'
import { curiositiesFixture } from './curiosity-list.fixtures'

const meta = {
  title: 'Players/CuriosityList',
  component: CuriosityList,
  args: { playerId: squadPlayerFixture.id, curiosities: curiositiesFixture, canEdit: true },
} satisfies Meta<typeof CuriosityList>

export default meta

type Story = StoryObj<typeof meta>

export const Editable: Story = {}

export const ReadOnly: Story = { args: { canEdit: false } }

export const Empty: Story = { args: { curiosities: [], canEdit: false } }

export const InvalidCuriosity: Story = {
  beforeEach: () => {
    mocked(addCuriosity).mockResolvedValue({ ok: false, error: 'Confira os campos.', fieldErrors: { text: ['Use no máximo 160 caracteres.'] } })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox', { name: 'Nova curiosidade' }), 'Faz embaixadinhas com a laranja.')
    await userEvent.click(canvas.getByRole('button', { name: 'Adicionar' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Use no máximo 160 caracteres.')
  },
}
