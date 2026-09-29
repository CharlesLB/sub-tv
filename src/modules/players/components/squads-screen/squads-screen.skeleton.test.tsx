import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadsSkeleton } from './squads-screen.skeleton'

describe('SquadsSkeleton', () => {
  it('hides the team list, roster and sheet placeholders from assistive technology', () => {
    const { container } = render(<SquadsSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild?.children).toHaveLength(3)
  })
})
