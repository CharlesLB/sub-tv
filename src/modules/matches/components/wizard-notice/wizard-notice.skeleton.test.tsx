import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WizardNoticeSkeleton } from './wizard-notice.skeleton'

const ICON_PLACEHOLDERS = 1
const LINE_PLACEHOLDERS = 4

describe('WizardNoticeSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<WizardNoticeSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the icon and the text lines of the notice', () => {
    const { container } = render(<WizardNoticeSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(ICON_PLACEHOLDERS + LINE_PLACEHOLDERS)
  })
})
