import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RowsSkeleton } from './rows-skeleton'

const HIDDEN_PLACEHOLDER_SELECTOR = 'span[aria-hidden="true"]'

describe('RowsSkeleton', () => {
  it('draws a title placeholder and four placeholders per row', () => {
    const { container } = render(<RowsSkeleton rowCount={5} titleWidthClass="w-[210px]" />)

    expect(container.querySelectorAll(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveLength(21)
  })

  it('applies the title width to the title placeholder and hides the section', () => {
    const { container } = render(<RowsSkeleton rowCount={2} titleWidthClass="w-[240px]" className="pt-[22px]" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('pt-[22px]')
    expect(container.querySelector(HIDDEN_PLACEHOLDER_SELECTOR)).toHaveClass('w-[240px]')
  })
})
