import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsersTableSkeleton } from './users-table.skeleton'

const ROW_COUNT = 3
const PLACEHOLDERS_PER_ROW = 5

describe('UsersTableSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<UsersTableSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the users column headers above three placeholder rows', () => {
    render(<UsersTableSkeleton />)

    expect(screen.getAllByRole('columnheader', { hidden: true }).map((header) => header.textContent)).toEqual(['Nome', 'Situação', 'Último acesso', 'Ações'])
    expect(screen.getAllByRole('row', { hidden: true })).toHaveLength(ROW_COUNT + 1)
  })

  it('draws the name, status and last sign in placeholders and both action buttons in each row', () => {
    const { container } = render(<UsersTableSkeleton />)

    expect(container.querySelectorAll('tbody span[aria-hidden]')).toHaveLength(ROW_COUNT * PLACEHOLDERS_PER_ROW)
  })
})
