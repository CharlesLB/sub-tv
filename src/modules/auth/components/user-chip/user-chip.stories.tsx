import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getCurrentUser } from '../../services/current-user'
import { UserChip } from './user-chip'
import { signedInUserFixture } from './user-chip.fixtures'

const meta = {
  title: 'Auth/UserChip',
  component: UserChip,
  beforeEach: () => {
    mocked(getCurrentUser).mockResolvedValue(signedInUserFixture)
  },
} satisfies Meta<typeof UserChip>

export default meta

type Story = StoryObj<typeof meta>

export const SignedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Marina Couto')).toBeInTheDocument()
    await expect(canvas.getByText('Sair')).toBeInTheDocument()
  },
}

export const SignedOut: Story = {
  beforeEach: () => {
    mocked(getCurrentUser).mockResolvedValue(null)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('link', { name: 'Entrar' })).toBeInTheDocument()
  },
}
