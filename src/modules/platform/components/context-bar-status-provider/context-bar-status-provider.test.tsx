import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContextBarStatusProvider, useContextBarStatus } from './context-bar-status-provider'

function StatusReader() {
  return <output aria-label="Status lido">{useContextBarStatus()}</output>
}

describe('ContextBarStatusProvider', () => {
  it('renders its children and hands the status to whoever reads it below', () => {
    render(
      <ContextBarStatusProvider status={<span>Transmissão ao vivo</span>}>
        <p>Conteúdo da página</p>
        <StatusReader />
      </ContextBarStatusProvider>,
    )

    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Status lido' })).toHaveTextContent('Transmissão ao vivo')
  })

  it('reads nothing when there is no provider above', () => {
    render(<StatusReader />)

    expect(screen.getByRole('status', { name: 'Status lido' })).toBeEmptyDOMElement()
  })
})
