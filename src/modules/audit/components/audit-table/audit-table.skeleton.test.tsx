import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditTableSkeleton } from './audit-table.skeleton'

const ROW_COUNT = 10
const PLACEHOLDERS_PER_ROW = 6

describe('AuditTableSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<AuditTableSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the audit column headers above ten placeholder rows', () => {
    render(<AuditTableSkeleton />)

    expect(screen.getAllByRole('columnheader', { hidden: true }).map((header) => header.textContent)).toEqual(['Quando', 'Quem', 'O quê', 'Onde', 'Detalhes'])
    expect(screen.getAllByRole('row', { hidden: true })).toHaveLength(ROW_COUNT + 1)
  })

  it('draws one placeholder per cell and two in the entity cell', () => {
    const { container } = render(<AuditTableSkeleton />)

    expect(container.querySelectorAll('tbody span[aria-hidden]')).toHaveLength(ROW_COUNT * PLACEHOLDERS_PER_ROW)
  })
})
