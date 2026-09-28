import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamListSkeleton } from './team-list-skeleton'

describe('TeamListSkeleton', () => {
  it('hides the placeholder from assistive technology and draws four team rows', () => {
    const { container } = render(<TeamListSkeleton />)

    const list = container.firstElementChild
    expect(list).toHaveAttribute('aria-hidden', 'true')
    expect(list?.children).toHaveLength(7)
  })
})
