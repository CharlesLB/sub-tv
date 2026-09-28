import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { signInRoutes } from '@/lib/routes'
import { SignInToEdit } from './sign-in-to-edit'

describe('SignInToEdit', () => {
  it('links to the sign in page that returns to the given path', () => {
    render(<SignInToEdit returnTo="/elencos?temporada=2025" />)

    expect(screen.getByRole('link', { name: 'Entre para editar esta ficha' })).toHaveAttribute('href', signInRoutes.signInTo('/elencos?temporada=2025'))
  })
})
