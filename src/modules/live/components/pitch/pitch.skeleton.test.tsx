import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { layoutStarters, STARTERS_PER_TEAM } from '@/modules/matches/client'
import { playerDotStyles } from '../player-dot/player-dot.styles'
import { PitchSkeleton } from './pitch.skeleton'
import { pitchStyles } from './pitch.styles'

const BOTH_TEAMS_STARTERS = STARTERS_PER_TEAM * 2
const dotWrappersOf = (container: HTMLElement): HTMLElement[] => Array.from(container.querySelectorAll<HTMLElement>('.w-\\[13\\%\\]'))

describe('PitchSkeleton', () => {
  it('draws a placeholder dot for every starter of both teams', () => {
    const { container } = render(<PitchSkeleton />)

    expect(dotWrappersOf(container)).toHaveLength(BOTH_TEAMS_STARTERS)
  })

  it('places the placeholder dots at the default formation points of the real pitch', () => {
    const { container } = render(<PitchSkeleton />)
    const homeGoalkeeper = layoutStarters([{ key: 'goalkeeper', shirtNumber: 1, position: null }], true).goalkeeper

    expect(dotWrappersOf(container)[0]).toHaveStyle({ left: `${homeGoalkeeper?.x}%`, top: `${homeGoalkeeper?.y}%` })
    expect(dotWrappersOf(container)[0]).toHaveClass(...playerDotStyles.wrapper.split(' '))
  })

  it('fades the away team placeholders', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.querySelectorAll('.bg-pan2')).toHaveLength(BOTH_TEAMS_STARTERS)
  })

  it('frames the placeholder field exactly like the real pitch and hides it from assistive technology', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...pitchStyles.frame.split(' '))
    expect(container.firstElementChild?.firstElementChild).toHaveClass(...pitchStyles.field.split(' '))
  })

  it('draws the same pitch markings as the real pitch', () => {
    const { container } = render(<PitchSkeleton />)

    expect(container.querySelectorAll('.border-gr-linha')).toHaveLength(5)
    expect(container.querySelectorAll('.bg-gr-linha')).toHaveLength(2)
  })
})
