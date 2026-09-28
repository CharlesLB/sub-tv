import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsersSkeleton } from './users-skeleton'

const FORM_PLACEHOLDER_COUNT = 1
const ROW_COUNT = 4
const PLACEHOLDERS_PER_ROW = 2

describe('UsersSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<UsersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the form placeholder and two placeholders for each of the four rows', () => {
    const { container } = render(<UsersSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(FORM_PLACEHOLDER_COUNT + ROW_COUNT * PLACEHOLDERS_PER_ROW)
  })
})
