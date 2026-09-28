import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, mocked, within } from 'storybook/test'
import { getAuditEntries } from '../../data/get-audit-entries'
import { getAuditUserOptions } from '../../data/get-audit-user-options'
import { auditUserOptionsFixture } from '../audit-filters/audit-filters.fixtures'
import { AuditLogScreen } from './audit-log-screen'
import { auditPageFixture, emptyAuditPageFixture } from './audit-log-screen.fixtures'

const meta = {
  title: 'Audit/AuditLogScreen',
  component: AuditLogScreen,
  args: { query: {} },
  beforeEach: () => {
    mocked(getAuditUserOptions).mockResolvedValue(auditUserOptionsFixture)
    mocked(getAuditEntries).mockResolvedValue(auditPageFixture)
  },
} satisfies Meta<typeof AuditLogScreen>

export default meta

type Story = StoryObj<typeof meta>

export const WithChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('table', { name: 'Registro de alterações' })).toBeInTheDocument()
    await expect(canvas.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument()
  },
}

export const WithoutChanges: Story = {
  beforeEach: () => {
    mocked(getAuditEntries).mockResolvedValue(emptyAuditPageFixture)
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Nenhuma alteração encontrada para os filtros selecionados')).toBeInTheDocument()
  },
}
