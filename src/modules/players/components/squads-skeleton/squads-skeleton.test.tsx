import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadsSkeleton } from './squads-skeleton'

describe('SquadsSkeleton', () => {
  it('hides the team list and workspace placeholders from assistive technology', () => {
    const { container } = render(<SquadsSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild?.children).toHaveLength(3)
  })
})
