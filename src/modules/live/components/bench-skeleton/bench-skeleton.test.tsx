import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BenchSkeleton } from './bench-skeleton'

const skeletonBlocksOf = (container: HTMLElement): HTMLElement[] => Array.from(container.querySelectorAll<HTMLElement>('[aria-hidden]'))

describe('BenchSkeleton', () => {
  it('draws a header and four reserve placeholders hidden from assistive technology', () => {
    const { container } = render(<BenchSkeleton delayOffsetMs={0} />)

    expect(skeletonBlocksOf(container)).toHaveLength(10)
  })

  it('staggers the shimmer from the given delay offset', () => {
    const { container } = render(<BenchSkeleton delayOffsetMs={200} />)

    const delays = skeletonBlocksOf(container).map((block) => block.style.animationDelay)

    expect(delays).toEqual(['200ms', '260ms', '300ms', '340ms', '380ms', '420ms', '460ms', '500ms', '540ms', '580ms'])
  })

  it('fades the last two reserve placeholders', () => {
    const { container } = render(<BenchSkeleton delayOffsetMs={0} />)

    const faintBlocks = skeletonBlocksOf(container).filter((block) => block.classList.contains('bg-pan2'))

    expect(faintBlocks).toHaveLength(4)
  })
})
