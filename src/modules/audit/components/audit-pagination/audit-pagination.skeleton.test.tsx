import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditPaginationSkeleton } from './audit-pagination.skeleton'

describe('AuditPaginationSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<AuditPaginationSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the previous link, the page number and the next link', () => {
    const { container } = render(<AuditPaginationSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(3)
  })
})
