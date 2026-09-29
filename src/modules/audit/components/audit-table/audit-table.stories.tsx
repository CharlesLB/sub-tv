import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { AuditTable } from './audit-table'
import { auditRowsFixture } from './audit-table.fixtures'
import { AuditTableSkeleton } from './audit-table.skeleton'

const meta = {
  title: 'Audit/AuditTable',
  component: AuditTable,
  args: { rows: auditRowsFixture },
} satisfies Meta<typeof AuditTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithChanges: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Caio Mendes (Caiozinho)')).toBeInTheDocument()
  },
}

export const Empty: Story = { args: { rows: [] } }

export const Loading: Story = { render: () => <AuditTableSkeleton /> }
