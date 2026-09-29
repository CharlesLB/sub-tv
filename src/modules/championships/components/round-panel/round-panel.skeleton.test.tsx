import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RoundPanelSkeleton } from './round-panel.skeleton'

describe('RoundPanelSkeleton', () => {
  it('hides the placeholder panel from assistive technology', () => {
    const { container } = render(<RoundPanelSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the header, three round match card placeholders and the all rounds link', () => {
    const { container } = render(<RoundPanelSkeleton />)

    expect(container.querySelectorAll(':scope > aside > div[aria-hidden]')).toHaveLength(3)
    expect(container.firstElementChild?.children).toHaveLength(5)
  })
})
