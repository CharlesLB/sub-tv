import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlatformRailSkeleton } from './platform-rail-skeleton'

describe('PlatformRailSkeleton', () => {
  it('shows only the brand logo while the navigation loads', () => {
    render(<PlatformRailSkeleton />)

    expect(screen.getByTitle('sub.tv')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
