import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NewMatchWizardSkeleton } from './new-match-wizard-skeleton'

describe('NewMatchWizardSkeleton', () => {
  it('marks the wizard placeholder as busy with an accessible label', () => {
    render(<NewMatchWizardSkeleton />)

    expect(screen.getByLabelText('Carregando nova partida')).toHaveAttribute('aria-busy', 'true')
  })
})
