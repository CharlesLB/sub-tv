import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from './breadcrumbs'
import { championshipCrumbsFixture, dotSeparatedCrumbsFixture } from './breadcrumbs.fixtures'

describe('Breadcrumbs', () => {
  it('links every crumb that has a destination and marks the last one as the current page', () => {
    render(<Breadcrumbs crumbs={championshipCrumbsFixture} />)

    const trail = screen.getByRole('navigation', { name: 'Trilha de navegação' })
    expect(within(trail).getByRole('link', { name: 'Campeonatos' })).toHaveAttribute('href', '/campeonatos?temporada=2025')
    expect(within(trail).getAllByRole('link')).toHaveLength(2)
    expect(within(trail).getByText('Mineiro Sub-14')).toHaveAttribute('aria-current', 'page')
  })

  it('puts a slash between crumbs by default and none before the first crumb', () => {
    render(<Breadcrumbs crumbs={championshipCrumbsFixture} />)

    expect(screen.getAllByText('/')).toHaveLength(2)
  })

  it('uses the separator chosen by the crumb when it has one', () => {
    render(<Breadcrumbs crumbs={dotSeparatedCrumbsFixture} />)

    expect(screen.getByText('·')).toBeInTheDocument()
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })

  it('staggers the entrance animation of each crumb', () => {
    render(<Breadcrumbs crumbs={championshipCrumbsFixture} />)

    expect(screen.getByRole('link', { name: '2025' }).parentElement).toHaveStyle({ animationDelay: '50ms' })
  })
})
