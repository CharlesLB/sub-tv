import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditFiltersSkeleton } from './audit-filters.skeleton'

const FILTER_COUNT = 4
const PLACEHOLDERS_PER_FILTER = 2
const ACTION_PLACEHOLDERS = 2

describe('AuditFiltersSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<AuditFiltersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws a label and a field for each of the four filters plus the two actions', () => {
    const { container } = render(<AuditFiltersSkeleton />)

    expect(container.firstElementChild?.children).toHaveLength(FILTER_COUNT + 1)
    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(FILTER_COUNT * PLACEHOLDERS_PER_FILTER + ACTION_PLACEHOLDERS)
  })
})
