import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OfficialsStripSkeleton } from './officials-strip.skeleton'
import { officialsStripStyles } from './officials-strip.styles'

const OFFICIALS_STRIP_ITEMS = 6

describe('OfficialsStripSkeleton', () => {
  it('lays out the placeholder strip like the real officials strip and hides it from assistive technology', () => {
    const { container } = render(<OfficialsStripSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...officialsStripStyles.strip.split(' '))
  })

  it('draws an icon, a label and a value placeholder for each of the six usual items', () => {
    const { container } = render(<OfficialsStripSkeleton />)

    const items = Array.from(container.firstElementChild?.children ?? [])

    expect(items).toHaveLength(OFFICIALS_STRIP_ITEMS)
    expect(items.every((item) => item.children.length === 3)).toBe(true)
    expect(items[0]).toHaveClass(...officialsStripStyles.item.split(' '))
  })
})
