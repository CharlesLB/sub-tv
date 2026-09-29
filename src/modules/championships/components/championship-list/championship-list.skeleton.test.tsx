import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORIES, categoryBorderClass } from '../../categories'
import { ChampionshipListSkeleton } from './championship-list.skeleton'

const CARD_SKELETON_SELECTOR = '.rounded-card.bg-pan'

describe('ChampionshipListSkeleton', () => {
  it('hides the placeholder from assistive technology', () => {
    const { container } = render(<ChampionshipListSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws one column per category with its colored header line', () => {
    const { container } = render(<ChampionshipListSkeleton />)

    const borderClasses = CATEGORIES.map((category) => categoryBorderClass[category])
    expect(borderClasses.map((borderClass) => container.getElementsByClassName(borderClass).length)).toEqual([1, 1])
  })

  it('draws two championship card placeholders in each category column', () => {
    const { container } = render(<ChampionshipListSkeleton />)

    expect(container.querySelectorAll(CARD_SKELETON_SELECTOR)).toHaveLength(CATEGORIES.length * 2)
  })
})
