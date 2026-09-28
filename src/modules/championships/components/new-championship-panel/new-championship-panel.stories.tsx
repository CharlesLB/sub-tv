import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, mocked, userEvent, waitFor, within } from 'storybook/test'
import { createChampionship } from '../../actions/championship-actions'
import { CATEGORY } from '../../categories'
import { clearFlashMessage } from '../../flash-message/flash-message'
import { categoryClubsFixture, categoryClubsWithoutSub14Fixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipPanel } from './new-championship-panel'

const CREATED_SEASON_ID = 'b2c3d4e5-0001-4f5a-8b9c-0d1e2f3a4b5c'

const meta = {
  title: 'Championships/NewChampionshipPanel',
  component: NewChampionshipPanel,
  args: { initialCategory: CATEGORY.SUB13, defaultYear: 2025, clubs: categoryClubsFixture, onClose: fn() },
  beforeEach: () => clearFlashMessage,
} satisfies Meta<typeof NewChampionshipPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const CategoryWithoutClubs: Story = { args: { initialCategory: CATEGORY.SUB14, clubs: categoryClubsWithoutSub14Fixture } }

export const MissingName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Criar campeonato' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Defina nome e categoria do campeonato')
  },
}

export const Created: Story = {
  beforeEach: () => {
    mocked(createChampionship).mockResolvedValue({ ok: true, data: { seasonId: CREATED_SEASON_ID } })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Nome'), 'Copa do Vale')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Serrano FC' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Criar campeonato' }))
    await waitFor(() => expect(createChampionship).toHaveBeenCalled())
  },
}

export const CreateFailed: Story = {
  beforeEach: () => {
    mocked(createChampionship).mockResolvedValue({ ok: false, error: 'Já existe um campeonato com esse nome.' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Nome'), 'Copa do Vale')
    await userEvent.click(canvas.getByRole('button', { name: 'Criar campeonato' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Já existe um campeonato com esse nome.')
  },
}
