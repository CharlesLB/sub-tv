import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, mocked, screen, userEvent, within } from 'storybook/test'
import { createManualPlayer } from '../../actions/player-actions'
import { teamSquadFixture } from '../squad-header/squad-header.fixtures'
import { NewPlayerPopover } from './new-player-popover'

const UNNAMED_DIALOG_RULE = 'aria-dialog-name'
const COLOR_CONTRAST_RULE = 'color-contrast'

const withUnnamedDialog = {
  a11y: {
    config: {
      rules: [
        { id: COLOR_CONTRAST_RULE, enabled: false },
        { id: UNNAMED_DIALOG_RULE, enabled: false },
      ],
    },
  },
}

const meta = {
  title: 'Players/NewPlayerPopover',
  component: NewPlayerPopover,
  args: { squad: teamSquadFixture, onPlayerCreated: fn() },
} satisfies Meta<typeof NewPlayerPopover>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  parameters: withUnnamedDialog,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /\+ novo/ }))
    await expect(await screen.findByText('Novo jogador SUB-14')).toBeInTheDocument()
  },
}

export const DuplicatedNumber: Story = {
  parameters: withUnnamedDialog,
  beforeEach: () => {
    mocked(createManualPlayer).mockResolvedValue({ ok: false, error: 'Número 17 já está em uso neste elenco.' })
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /\+ novo/ }))
    await userEvent.type(await screen.findByLabelText('Número'), '17')
    await userEvent.type(screen.getByLabelText('Nome completo'), 'Bruno Carvalho Nunes')
    await userEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
    await expect(await screen.findByRole('alert')).toHaveTextContent('Número 17 já está em uso neste elenco.')
  },
}
