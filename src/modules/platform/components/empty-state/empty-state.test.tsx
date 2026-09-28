import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('shows the title and the description without an action link by default', () => {
    render(<EmptyState title="Nenhum campeonato" description="Ainda não há campeonatos nesta temporada." />)

    expect(screen.getByText('Nenhum campeonato')).toBeInTheDocument()
    expect(screen.getByText('Ainda não há campeonatos nesta temporada.')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('links to the action destination when an action is given', () => {
    render(<EmptyState title="Nenhum campeonato" description="Ainda não há campeonatos nesta temporada." action={{ label: 'Ver temporadas', href: routes.championships() }} />)

    expect(screen.getByRole('link', { name: 'Ver temporadas' })).toHaveAttribute('href', '/campeonatos')
  })
})
