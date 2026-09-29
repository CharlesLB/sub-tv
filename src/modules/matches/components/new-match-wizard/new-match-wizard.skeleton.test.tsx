import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NewMatchWizardSkeleton } from './new-match-wizard.skeleton'

const SECTION_COUNT = 3
const PAGE_PLACEHOLDER_COUNT = 30
const SHEET_PLACEHOLDER_COUNT = 25

describe('NewMatchWizardSkeleton', () => {
  it('hides the stepper, the first step and the footer placeholders from assistive technology', () => {
    const { container } = render(<NewMatchWizardSkeleton presentation="page" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild?.children).toHaveLength(SECTION_COUNT)
  })

  it('on the page draws the category notice below the first step fields', () => {
    const { container } = render(<NewMatchWizardSkeleton presentation="page" />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(PAGE_PLACEHOLDER_COUNT)
  })

  it('in the sheet leaves the notice out, like the wizard', () => {
    const { container } = render(<NewMatchWizardSkeleton presentation="sheet" />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(SHEET_PLACEHOLDER_COUNT)
  })
})
