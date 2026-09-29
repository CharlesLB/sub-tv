import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayerSheetSkeleton } from './player-sheet.skeleton'

describe('PlayerSheetSkeleton', () => {
  it('hides the sheet placeholder from assistive technology', () => {
    const { container } = render(<PlayerSheetSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('draws two curiosity lines and a two-line category note', () => {
    const { container } = render(<PlayerSheetSkeleton />)

    expect(container.querySelectorAll('li')).toHaveLength(2)
    expect(container.querySelector('p')?.children).toHaveLength(2)
  })
})
