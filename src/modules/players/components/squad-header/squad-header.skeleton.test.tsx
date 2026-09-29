import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadHeaderSkeleton } from './squad-header.skeleton'

describe('SquadHeaderSkeleton', () => {
  it('hides the header placeholder from assistive technology', () => {
    const { container } = render(<SquadHeaderSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the crest, identity and search placeholders without a real search box', () => {
    const { container } = render(<SquadHeaderSkeleton />)

    expect(container.firstElementChild?.children).toHaveLength(3)
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })
})
