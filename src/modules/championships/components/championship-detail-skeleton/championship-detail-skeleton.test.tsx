import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipDetailSkeleton } from './championship-detail-skeleton'

const SKELETON_BLOCK_SELECTOR = 'span[aria-hidden]'
const TAB_BLOCKS = 3
const STANDINGS_BLOCKS = 2 + 8 * 4
const ROUND_BLOCKS = 4

describe('ChampionshipDetailSkeleton', () => {
  it('hides the placeholder from assistive technology', () => {
    const { container } = render(<ChampionshipDetailSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the tabs, eight standings rows and the round cards placeholders', () => {
    const { container } = render(<ChampionshipDetailSkeleton />)

    expect(container.querySelectorAll(SKELETON_BLOCK_SELECTOR)).toHaveLength(TAB_BLOCKS + STANDINGS_BLOCKS + ROUND_BLOCKS)
  })
})
