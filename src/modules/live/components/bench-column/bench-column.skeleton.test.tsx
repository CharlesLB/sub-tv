import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SIDE } from '@/modules/matches/client'
import { benchDotStyles } from '../bench-dot/bench-dot.styles'
import { BenchColumnSkeleton } from './bench-column.skeleton'
import { benchColumnStyles } from './bench-column.styles'

const PLACEHOLDER_RESERVES = 5
const reservesOf = (container: HTMLElement): Element[] => Array.from(container.firstElementChild?.children ?? []).slice(1)

describe('BenchColumnSkeleton', () => {
  it('lays out the home placeholder like the real home bench and hides it from assistive technology', () => {
    const { container } = render(<BenchColumnSkeleton side={SIDE.HOME} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...benchColumnStyles.column.split(' '), benchColumnStyles.columnHome)
    expect(container.firstElementChild?.firstElementChild).toHaveClass(...benchColumnStyles.header.split(' '))
  })

  it('places the away placeholder in the away grid column', () => {
    const { container } = render(<BenchColumnSkeleton side={SIDE.AWAY} />)

    expect(container.firstElementChild).toHaveClass(benchColumnStyles.columnAway)
  })

  it('draws the reserve placeholders with the real bench dot layout and fades the last two', () => {
    const { container } = render(<BenchColumnSkeleton side={SIDE.HOME} />)

    const reserves = reservesOf(container)

    expect(reserves).toHaveLength(PLACEHOLDER_RESERVES)
    expect(reserves[0]).toHaveClass(...benchDotStyles.button.split(' '))
    expect(reserves.filter((reserve) => reserve.firstElementChild?.classList.contains('bg-pan2'))).toHaveLength(2)
  })

  it('starts the away shimmer after the home one', () => {
    const { container } = render(<BenchColumnSkeleton side={SIDE.AWAY} />)

    expect(container.querySelector<HTMLElement>('[aria-hidden] [aria-hidden]')?.style.animationDelay).toBe('50ms')
  })
})
