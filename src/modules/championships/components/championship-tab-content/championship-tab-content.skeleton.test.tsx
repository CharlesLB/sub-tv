import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipDetailSkeleton, ChampionshipTabContentSkeleton } from './championship-tab-content.skeleton'

describe('ChampionshipDetailSkeleton', () => {
  it('draws the tabs and the default tab body as hidden siblings, like the real page', () => {
    const { container } = render(<ChampionshipDetailSkeleton />)

    const siblings = Array.from(container.children)
    expect(siblings).toHaveLength(2)
    expect(siblings.map((sibling) => sibling.getAttribute('aria-hidden'))).toEqual(['true', 'true'])
  })

  it('places the standings panel and the round panel placeholders side by side in the tab body', () => {
    const { container } = render(<ChampionshipDetailSkeleton />)

    expect(container.querySelector('section')).toBeInTheDocument()
    expect(container.querySelector('aside')).toBeInTheDocument()
  })

  it('draws only the hidden tab body when the tabs are already on screen', () => {
    const { container } = render(<ChampionshipTabContentSkeleton />)

    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })
})
