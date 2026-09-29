import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CompetitionPresenceListSkeleton } from './competition-presence-list.skeleton'

describe('CompetitionPresenceListSkeleton', () => {
  it('hides the presences from assistive technology and exposes no heading', () => {
    const { container } = render(<CompetitionPresenceListSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws two presence items with a name and a season count placeholder each', () => {
    const { container } = render(<CompetitionPresenceListSkeleton />)

    const items = [...(container.firstElementChild?.lastElementChild?.children ?? [])]
    expect(items).toHaveLength(2)
    expect(items[0]?.children).toHaveLength(2)
  })
})
