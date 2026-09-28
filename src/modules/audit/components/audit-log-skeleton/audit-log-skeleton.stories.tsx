import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AuditLogSkeleton } from './audit-log-skeleton'

const meta = {
  title: 'Audit/AuditLogSkeleton',
  component: AuditLogSkeleton,
} satisfies Meta<typeof AuditLogSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
