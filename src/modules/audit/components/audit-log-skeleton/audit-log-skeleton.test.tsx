import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditLogSkeleton } from './audit-log-skeleton'

const FILTER_COUNT = 5
const PLACEHOLDERS_PER_FILTER = 2
const ROW_COUNT = 10
const PLACEHOLDERS_PER_ROW = 4

describe('AuditLogSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<AuditLogSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws two placeholders per filter and four per table row', () => {
    const { container } = render(<AuditLogSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(FILTER_COUNT * PLACEHOLDERS_PER_FILTER + ROW_COUNT * PLACEHOLDERS_PER_ROW)
  })
})
