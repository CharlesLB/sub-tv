import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StandingsPanelSkeleton } from './standings-panel.skeleton'

describe('StandingsPanelSkeleton', () => {
  it('hides the placeholder panel from assistive technology', () => {
    const { container } = render(<StandingsPanelSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the standings table placeholder between the header and the legend', () => {
    const { container } = render(<StandingsPanelSkeleton />)

    const sections = Array.from(container.firstElementChild?.children ?? [])
    expect(sections).toHaveLength(3)
    expect(screen.getByText('Clube')).toBeInTheDocument()
  })
})
