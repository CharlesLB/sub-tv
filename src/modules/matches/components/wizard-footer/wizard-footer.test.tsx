import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { WizardFooter } from './wizard-footer'

const HINT = 'Etapa 1 de 4 — data, horário, local e rodada'

const propsOf = (overrides: Partial<ComponentProps<typeof WizardFooter>> = {}): ComponentProps<typeof WizardFooter> => ({
  hint: HINT,
  isSummaryOpen: false,
  isFirstStep: true,
  isFinalStep: false,
  canAdvance: true,
  isSubmitting: false,
  onToggleSummary: vi.fn(),
  onBack: vi.fn(),
  onNext: vi.fn(),
  onSubmit: vi.fn(),
  ...overrides,
})

describe('WizardFooter', () => {
  it('shows the hint, a cancel button and the continue button on the first step', () => {
    render(<WizardFooter {...propsOf()} />)

    expect(screen.getByText(HINT)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveAttribute('aria-disabled', 'false')
  })

  it('shows a back button after the first step', () => {
    render(<WizardFooter {...propsOf({ isFirstStep: false })} />)

    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('marks continue as disabled and ignores the click when the step is incomplete', async () => {
    const onNext = vi.fn()
    render(<WizardFooter {...propsOf({ canAdvance: false, onNext })} />)

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveAttribute('aria-disabled', 'true')
    expect(onNext).not.toHaveBeenCalled()
  })

  it('shows the create button on the final step and submits on click', async () => {
    const onSubmit = vi.fn()
    render(<WizardFooter {...propsOf({ isFirstStep: false, isFinalStep: true, onSubmit })} />)

    await userEvent.click(screen.getByRole('button', { name: 'Criar e ir ao vivo' }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
  })

  it('disables the create button when the wizard cannot advance', () => {
    render(<WizardFooter {...propsOf({ isFinalStep: true, canAdvance: false })} />)

    expect(screen.getByRole('button', { name: 'Criar e ir ao vivo' })).toBeDisabled()
  })

  it('shows the pending label and disables the create button while submitting', () => {
    render(<WizardFooter {...propsOf({ isFinalStep: true, isSubmitting: true })} />)

    const submitButton = screen.getByRole('button', { name: 'Criando partida…' })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('aria-busy', 'true')
  })

  it('reflects the summary state and reports toggle and back clicks', async () => {
    const onToggleSummary = vi.fn()
    const onBack = vi.fn()
    render(<WizardFooter {...propsOf({ isSummaryOpen: true, onToggleSummary, onBack })} />)

    await userEvent.click(screen.getByRole('button', { name: 'Resumo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('button', { name: 'Resumo' })).toHaveAttribute('aria-expanded', 'true')
    expect(onToggleSummary).toHaveBeenCalledOnce()
    expect(onBack).toHaveBeenCalledOnce()
  })
})
