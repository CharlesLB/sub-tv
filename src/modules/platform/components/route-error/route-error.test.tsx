import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RouteError } from './route-error'

describe('RouteError', () => {
  it('shows the default title and description inside an alert', () => {
    render(<RouteError retry={vi.fn()} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Não foi possível carregar esta parte.')
    expect(alert).toHaveTextContent('Tente de novo. Se continuar, avise a coordenação da transmissão.')
  })

  it('shows the custom title and description when they are given', () => {
    render(<RouteError title="Partida indisponível" description="Volte à lista de partidas." retry={vi.fn()} />)

    expect(screen.getByText('Partida indisponível')).toBeInTheDocument()
    expect(screen.getByText('Volte à lista de partidas.')).toBeInTheDocument()
    expect(screen.queryByText('Não foi possível carregar esta parte.')).not.toBeInTheDocument()
  })

  it('calls retry when the try again button is clicked', async () => {
    const retry = vi.fn()
    render(<RouteError retry={retry} />)

    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))

    expect(retry).toHaveBeenCalledOnce()
  })
})
