import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { emptyAuditFilterFixture } from '../audit-filters/audit-filters.fixtures'
import { AuditPagination } from './audit-pagination'

const meta = {
  title: 'Audit/AuditPagination',
  component: AuditPagination,
  args: { filter: emptyAuditFilterFixture, hasNextPage: true },
} satisfies Meta<typeof AuditPagination>

export default meta

type Story = StoryObj<typeof meta>

export const FirstPage: Story = {}

export const MiddlePage: Story = { args: { filter: { ...emptyAuditFilterFixture, page: 2 } } }

export const LastPage: Story = { args: { filter: { ...emptyAuditFilterFixture, page: 3 }, hasNextPage: false } }
