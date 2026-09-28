import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsersLink } from './users-link'

describe('UsersLink', () => {
  it('links to the users page', () => {
    render(<UsersLink />)

    expect(screen.getByRole('link', { name: 'Usuários' })).toHaveAttribute('href', '/usuarios')
  })
})
