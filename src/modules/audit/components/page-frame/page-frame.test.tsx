import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageFrame } from './page-frame'

describe('PageFrame', () => {
  it('renders its children inside the frame', () => {
    render(
      <PageFrame>
        <h1>Registro de alterações</h1>
      </PageFrame>,
    )

    expect(screen.getByRole('heading', { name: 'Registro de alterações' })).toBeInTheDocument()
  })
})
