import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NAVIGATION_PROGRESS_LABEL, NavigationProgress } from './navigation-progress'

describe('NavigationProgress', () => {
  it('shows a progress bar at the top of the page while a navigation is pending', () => {
    render(<NavigationProgress isActive />)

    const progress = screen.getByRole('progressbar', { name: NAVIGATION_PROGRESS_LABEL })
    expect(progress.parentElement).toBe(document.body)
  })

  it('renders nothing when no navigation is pending', () => {
    render(<NavigationProgress isActive={false} />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
