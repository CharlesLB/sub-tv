import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiGridSkeleton } from './kpi-grid.skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('KpiGridSkeleton', () => {
  it('draws a value and a label placeholder for each of the four indicator cards', () => {
    const { container } = render(<KpiGridSkeleton variant="detail" />)

    expect(container.firstElementChild?.children).toHaveLength(4)
    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(8)
  })

  it('hides the grid from assistive technology', () => {
    const { container } = render(<KpiGridSkeleton variant="overview" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('sizes the overview value bar with the overview value font', () => {
    const { container } = render(<KpiGridSkeleton variant="overview" />)

    expect(container.querySelector(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveClass('text-[30.6px]', 'h-[1lh]')
  })
})
