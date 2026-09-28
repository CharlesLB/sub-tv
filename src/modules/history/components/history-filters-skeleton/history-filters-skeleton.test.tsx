import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryFiltersSkeleton } from './history-filters-skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('HistoryFiltersSkeleton', () => {
  it('hides the whole filter placeholder from assistive technology', () => {
    const { container } = render(<HistoryFiltersSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws two labels, three category chips and eleven season chips', () => {
    const { container } = render(<HistoryFiltersSkeleton />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(16)
  })
})
