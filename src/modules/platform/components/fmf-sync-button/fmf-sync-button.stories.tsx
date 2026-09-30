import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getCurrentUser } from '@/modules/auth'
import { FmfSyncButton } from './fmf-sync-button'

const meta = {
  title: 'Platform/FmfSyncButton',
  component: FmfSyncButton,
  beforeEach: () => {
    mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', username: 'Marina Couto' })
  },
} satisfies Meta<typeof FmfSyncButton>

export default meta

type Story = StoryObj<typeof meta>

export const SignedIn: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('button', { name: 'Atualizar dados da FMF' })).toBeInTheDocument()
  },
}

export const SignedOut: Story = {
  beforeEach: () => {
    mocked(getCurrentUser).mockResolvedValue(null)
  },
}
