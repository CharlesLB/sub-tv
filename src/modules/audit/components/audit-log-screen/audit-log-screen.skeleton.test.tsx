import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditLogSkeleton } from './audit-log-screen.skeleton'

const SECTION_COUNT = 3

describe('AuditLogSkeleton', () => {
  it('draws the filters, the table and the pagination as hidden siblings, like the audit log screen', () => {
    const { container } = render(<AuditLogSkeleton />)

    expect(container.children).toHaveLength(SECTION_COUNT)
    expect(Array.from(container.children).every((section) => section.getAttribute('aria-hidden') === 'true')).toBe(true)
  })

  it('keeps the audit table headers in the placeholder table', () => {
    render(<AuditLogSkeleton />)

    expect(screen.getByRole('table', { name: 'Registro de alterações', hidden: true })).toBeInTheDocument()
  })
})
