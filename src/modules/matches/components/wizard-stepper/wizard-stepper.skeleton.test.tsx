import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WIZARD_STEPS } from '../../lib/wizard-reducer/wizard-reducer'
import { WizardStepperSkeleton } from './wizard-stepper.skeleton'

const PLACEHOLDERS_PER_STEP = 3

describe('WizardStepperSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<WizardStepperSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws a badge, a title and a value for each wizard step', () => {
    const { container } = render(<WizardStepperSkeleton />)

    expect(container.firstElementChild?.children).toHaveLength(WIZARD_STEPS.length)
    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(WIZARD_STEPS.length * PLACEHOLDERS_PER_STEP)
  })
})
