import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContextBarStatusProvider } from '../context-bar-status-provider/context-bar-status-provider'
import { ContextBarStatus } from './context-bar-status'

describe('ContextBarStatus', () => {
  it('shows the status chips given by the layout', () => {
    render(
      <ContextBarStatusProvider status={<button type="button">Sair</button>}>
        <ContextBarStatus />
      </ContextBarStatusProvider>,
    )

    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('shows nothing outside the platform layout', () => {
    const { container } = render(<ContextBarStatus />)

    expect(container).toBeEmptyDOMElement()
  })
})
