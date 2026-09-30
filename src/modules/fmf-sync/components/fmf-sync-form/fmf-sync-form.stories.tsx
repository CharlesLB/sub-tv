import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, userEvent, within } from 'storybook/test'
import { syncFmfData } from '../../actions/fmf-sync-actions'
import { FmfSyncForm } from './fmf-sync-form'

const meta = {
  title: 'FmfSync/FmfSyncForm',
  component: FmfSyncForm,
  beforeEach: () => {
    mocked(syncFmfData).mockResolvedValue({ ok: true, data: { matches: 42 } })
  },
} satisfies Meta<typeof FmfSyncForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Synced: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Atualizar dados da FMF' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('42 partidas conferidas na FMF')
  },
}

export const SyncFailed: Story = {
  beforeEach: () => {
    mocked(syncFmfData).mockResolvedValue({ ok: false, error: 'Não foi possível atualizar os dados da FMF.' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Atualizar dados da FMF' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Não foi possível atualizar os dados da FMF.')
  },
}
