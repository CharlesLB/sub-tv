import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WizardFooterSkeleton } from './wizard-footer.skeleton'

const PLACEHOLDER_COUNT = 5

describe('WizardFooterSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<WizardFooterSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the summary toggle, the hint lines and the back and next buttons', () => {
    const { container } = render(<WizardFooterSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(PLACEHOLDER_COUNT)
  })
})
