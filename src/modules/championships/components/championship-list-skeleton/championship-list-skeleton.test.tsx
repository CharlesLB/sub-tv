import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipListSkeleton } from './championship-list-skeleton'

const SKELETON_BLOCK_SELECTOR = 'span[aria-hidden]'
const COLUMNS = 2
const COLUMN_HEADER_BLOCKS = 2
const CARDS_PER_COLUMN = 2
const CARD_BLOCKS = 8

describe('ChampionshipListSkeleton', () => {
  it('hides the placeholder from assistive technology', () => {
    const { container } = render(<ChampionshipListSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws two category columns with two championship card placeholders each', () => {
    const { container } = render(<ChampionshipListSkeleton />)

    expect(container.querySelectorAll(SKELETON_BLOCK_SELECTOR)).toHaveLength(COLUMNS * (COLUMN_HEADER_BLOCKS + CARDS_PER_COLUMN * CARD_BLOCKS))
  })
})
