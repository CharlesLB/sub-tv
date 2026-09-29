import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { benchColumnStyles } from '../bench-column/bench-column.styles'
import { boardAreaStyles } from '../board-area/board-area.styles'
import { eventsStripStyles } from '../events-strip/events-strip.styles'
import { expandedTimelineStyles } from '../expanded-timeline/expanded-timeline.styles'
import { liveScoreboardStyles } from '../live-scoreboard/live-scoreboard.styles'
import { liveScreenStyles } from '../live-screen/live-screen.styles'
import { officialsStripStyles } from '../officials-strip/officials-strip.styles'
import { pitchStyles } from '../pitch/pitch.styles'
import { LiveSkeleton } from './live-board.skeleton'

describe('LiveSkeleton', () => {
  it('hides the whole placeholder screen from assistive technology with the real screen container', () => {
    const { container } = render(<LiveSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...liveScreenStyles.screen.split(' '))
  })

  it('stacks the scoreboard, officials strip and events strip placeholders like the loaded screen', () => {
    const { container } = render(<LiveSkeleton />)

    const [scoreboard, officials, events] = Array.from(container.firstElementChild?.children ?? [])

    expect(scoreboard).toHaveClass(...liveScoreboardStyles.bar.split(' '))
    expect(officials).toHaveClass(...officialsStripStyles.strip.split(' '))
    expect(events).toHaveClass(...eventsStripStyles.strip.split(' '))
  })

  it('puts the pitch between both benches in the real board grid', () => {
    const { container } = render(<LiveSkeleton />)

    const board = container.firstElementChild?.children[3]
    const [homeBench, pitch, awayBench] = Array.from(board?.children ?? [])

    expect(board).toHaveClass(...boardAreaStyles.board.split(' '))
    expect(homeBench).toHaveClass(benchColumnStyles.columnHome)
    expect(pitch).toHaveClass(...pitchStyles.frame.split(' '))
    expect(awayBench).toHaveClass(benchColumnStyles.columnAway)
  })

  it('keeps an expanded timeline placeholder that only portrait phones show', () => {
    const { container } = render(<LiveSkeleton />)

    const timelineSlot = container.firstElementChild?.children[4]

    expect(timelineSlot).toHaveClass('hidden', 'max-[619px]:portrait:flex')
    expect(timelineSlot?.firstElementChild).toHaveClass(...expandedTimelineStyles.panel.split(' '))
  })
})
