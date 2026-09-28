import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { boardAreaStyles } from '../board-area/board-area.styles'
import { officialsStripStyles } from '../officials-strip/officials-strip.styles'
import { LiveSkeleton } from './live-skeleton'

describe('LiveSkeleton', () => {
  it('hides the whole placeholder screen from assistive technology', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws a placeholder for every officials strip item and fades the last three', () => {
    const { container } = render(<LiveSkeleton />)

    const officialsBars = container.querySelectorAll('.h-\\[18px\\] > span')
    expect(officialsBars).toHaveLength(6)
    expect(Array.from(officialsBars).filter((bar) => bar.classList.contains('bg-pan2'))).toHaveLength(3)
  })

  it('draws three event chip placeholders and the pitch between both benches', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.querySelectorAll('.w-\\[150px\\]')).toHaveLength(3)
    expect(container.querySelectorAll('.turf')).toHaveLength(1)
  })

  it('lays out the officials strip and the board with the same classes as the loaded screen', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.querySelector('.h-\\[18px\\]')?.parentElement).toHaveClass(...officialsStripStyles.strip.split(' '))
    expect(container.querySelector('.turf')?.parentElement?.parentElement).toHaveClass(...boardAreaStyles.board.split(' '))
  })
})
