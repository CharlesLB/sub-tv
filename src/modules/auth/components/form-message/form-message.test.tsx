import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormMessage } from './form-message'

describe('FormMessage', () => {
  it('shows the error as an alert when the action failed', () => {
    render(<FormMessage state={{ ok: false, error: 'Confira os campos.' }} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Confira os campos.')
  })

  it('shows the success message as a status when the action succeeded', () => {
    render(<FormMessage state={{ ok: true, data: undefined }} successMessage="Senha redefinida." />)

    expect(screen.getByRole('status')).toHaveTextContent('Senha redefinida.')
  })

  it('renders nothing when the action succeeded without a success message', () => {
    const { container } = render(<FormMessage state={{ ok: true, data: undefined }} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing before the action runs', () => {
    const { container } = render(<FormMessage state={null} successMessage="Senha redefinida." />)

    expect(container).toBeEmptyDOMElement()
  })
})
