import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LIVE_EVENT_TYPE } from '@/modules/matches/client'
import { TIMELINE_MARKER } from '../../state/timeline'
import { homeTeamFixture } from '../live-board/live-board.fixtures'
import { EventIcon } from './event-icon'

describe('EventIcon', () => {
  it('paints a goal with the team color', () => {
    const { container } = render(<EventIcon kind={LIVE_EVENT_TYPE.GOAL} teamColor={homeTeamFixture.color} size={17} />)

    expect(container.firstElementChild).toHaveStyle({ color: homeTeamFixture.color })
  })

  it('leaves a goal without team color unstyled', () => {
    const { container } = render(<EventIcon kind={LIVE_EVENT_TYPE.GOAL} teamColor={null} size={17} />)

    expect(container.firstElementChild).not.toHaveAttribute('style')
  })

  it.each([
    [LIVE_EVENT_TYPE.YELLOW_CARD, 'text-am'],
    [LIVE_EVENT_TYPE.RED_CARD, 'text-vm'],
    [LIVE_EVENT_TYPE.SUBSTITUTION, 'text-az'],
    [TIMELINE_MARKER.HALF_TIME, 'text-tx4'],
    [TIMELINE_MARKER.FULL_TIME, 'text-tx4'],
  ])('colors a %s with its semantic class and ignores the team color', (kind, colorClass) => {
    const { container } = render(<EventIcon kind={kind} teamColor={homeTeamFixture.color} size={17} />)

    expect(container.firstElementChild).toHaveClass(colorClass)
    expect(container.firstElementChild).not.toHaveAttribute('style')
  })

  it('renders a decorative icon at the requested size', () => {
    const { container } = render(<EventIcon kind={LIVE_EVENT_TYPE.SUBSTITUTION} teamColor={null} size={22} />)

    expect(container.querySelector('svg')).toHaveAttribute('width', '22')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
