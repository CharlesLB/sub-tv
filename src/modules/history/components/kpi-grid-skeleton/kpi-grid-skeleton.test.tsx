import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiGridSkeleton } from './kpi-grid-skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('KpiGridSkeleton', () => {
  it('draws a value and a label placeholder for each requested card', () => {
    const { container } = render(<KpiGridSkeleton count={3} variant="highlight" />)

    expect(container.firstElementChild?.children).toHaveLength(3)
    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(6)
  })

  it('hides the grid from assistive technology and adds the extra class name', () => {
    const { container } = render(<KpiGridSkeleton count={4} variant="overview" className="mt-[22px]" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('mt-[22px]')
  })
})
