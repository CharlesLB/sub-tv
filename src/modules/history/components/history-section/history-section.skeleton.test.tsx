import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistorySectionSkeleton } from './history-section.skeleton'

describe('HistorySectionSkeleton', () => {
  it('hides the section from assistive technology and exposes no heading', () => {
    const { container } = render(
      <HistorySectionSkeleton titleWidthClass="w-[210px]">
        <p>Linhas</p>
      </HistorySectionSkeleton>,
    )

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws the title bar at the title font size with the given width and keeps the extra class', () => {
    const { container } = render(
      <HistorySectionSkeleton titleWidthClass="w-[240px]" className="pt-[22px]">
        <p>Linhas</p>
      </HistorySectionSkeleton>,
    )

    expect(container.firstElementChild).toHaveClass('pt-[22px]')
    expect(container.firstElementChild?.firstElementChild).toHaveClass('h-[1lh]', 'w-[240px]', 'text-[15.3px]')
    expect(screen.getByText('Linhas')).toBeInTheDocument()
  })
})
