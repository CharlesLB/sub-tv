import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AuditFilters } from './audit-filters'
import { auditUserOptionsFixture, emptyAuditFilterFixture, selectedAuditFilterFixture } from './audit-filters.fixtures'

const meta = {
  title: 'Audit/AuditFilters',
  component: AuditFilters,
  args: { filter: emptyAuditFilterFixture, users: auditUserOptionsFixture },
} satisfies Meta<typeof AuditFilters>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithSelection: Story = { args: { filter: selectedAuditFilterFixture } }
