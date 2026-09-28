import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WIZARD_STEP } from '../../wizard-reducer/wizard-reducer'
import { WizardStepper } from './wizard-stepper'
import { stepValuesFixture } from './wizard-stepper.fixtures'

describe('WizardStepper', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('marks the current step and shows every step title with its value', () => {
    render(<WizardStepper currentStep={WIZARD_STEP.TEAMS} values={stepValuesFixture} onGoBackTo={vi.fn()} />)

    expect(screen.getByRole('navigation', { name: 'Etapas da nova partida' })).toBeInTheDocument()
    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent('TimesEDV × ASE')
    expect(screen.getByText('Informações')).toBeInTheDocument()
    expect(screen.getByText('Confirmar e transmitir')).toBeInTheDocument()
  })

  it('enables only the finished steps and shows a check instead of their number', () => {
    render(<WizardStepper currentStep={WIZARD_STEP.LINEUPS} values={stepValuesFixture} onGoBackTo={vi.fn()} />)

    const information = screen.getByRole('button', { name: /Informações/ })
    const review = screen.getByRole('button', { name: /Revisão/ })

    expect(information).toBeEnabled()
    expect(screen.getByRole('button', { name: /Times/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Escalações/ })).toBeDisabled()
    expect(review).toBeDisabled()
    expect(within(information).queryByText('1')).not.toBeInTheDocument()
    expect(within(review).getByText('4')).toBeInTheDocument()
  })

  it('scrolls the active step into view', () => {
    render(<WizardStepper currentStep={WIZARD_STEP.REVIEW} values={stepValuesFixture} onGoBackTo={vi.fn()} />)

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
  })

  it('calls onGoBackTo with the step clicked', async () => {
    const onGoBackTo = vi.fn()
    render(<WizardStepper currentStep={WIZARD_STEP.REVIEW} values={stepValuesFixture} onGoBackTo={onGoBackTo} />)

    await userEvent.click(screen.getByRole('button', { name: /Times/ }))

    expect(onGoBackTo).toHaveBeenCalledWith(WIZARD_STEP.TEAMS)
  })
})
