import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveScoreboardSkeleton } from './live-scoreboard.skeleton'
import { liveScoreboardStyles } from './live-scoreboard.styles'

describe('LiveScoreboardSkeleton', () => {
  it('lays out the placeholder bar like the real scoreboard and hides it from assistive technology', () => {
    const { container } = render(<LiveScoreboardSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...liveScoreboardStyles.bar.split(' '))
  })

  it('draws both team blocks around the real score panel with two scores and the chrono', () => {
    const { container } = render(<LiveScoreboardSkeleton />)

    const scoreGroup = container.firstElementChild?.children[1]
    const scorePanel = scoreGroup?.children[1]

    expect(scoreGroup).toHaveClass(...liveScoreboardStyles.scoreGroup.split(' '))
    expect(scoreGroup?.children).toHaveLength(3)
    expect(scorePanel).toHaveClass(...liveScoreboardStyles.scorePanel.split(' '))
    expect(scorePanel?.children).toHaveLength(3)
  })
})
