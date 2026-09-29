import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsersSkeleton } from './users-screen.skeleton'

const SECTION_COUNT = 2

describe('UsersSkeleton', () => {
  it('draws the new user form and the users table as hidden siblings, like the users screen', () => {
    const { container } = render(<UsersSkeleton />)

    expect(container.children).toHaveLength(SECTION_COUNT)
    expect(Array.from(container.children).every((section) => section.getAttribute('aria-hidden') === 'true')).toBe(true)
  })

  it('keeps the users table headers in the placeholder table', () => {
    render(<UsersSkeleton />)

    expect(screen.getByRole('table', { name: 'Usuários', hidden: true })).toBeInTheDocument()
  })
})
