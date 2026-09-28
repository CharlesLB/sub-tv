import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { AUDIT_ENTITY } from '../../audit-action'
import { getLastChange } from '../../data/get-last-change'
import { LastChange } from './last-change'
import { lastChangeFixture } from './last-change.fixtures'

const meta = {
  title: 'Audit/LastChange',
  component: LastChange,
  args: { entityType: AUDIT_ENTITY.PLAYER, entityId: '5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c19' },
  beforeEach: () => {
    mocked(getLastChange).mockResolvedValue(lastChangeFixture)
  },
} satisfies Meta<typeof LastChange>

export default meta

type Story = StoryObj<typeof meta>

export const Changed: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Última alteração: Marina Couto · 20/09/2026 10:05')).toBeInTheDocument()
  },
}
