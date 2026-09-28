import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LivePill } from './live-pill'

describe('LivePill', () => {
  it('renders the live label', () => {
    render(<LivePill />)

    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
  })
})
