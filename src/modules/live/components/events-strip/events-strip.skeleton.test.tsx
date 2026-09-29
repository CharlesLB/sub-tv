import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventsStripSkeleton } from './events-strip.skeleton'
import { eventsStripStyles } from './events-strip.styles'

const PLACEHOLDER_CHIPS = 3

describe('EventsStripSkeleton', () => {
  it('lays out the placeholder strip like the real events strip and hides it from assistive technology', () => {
    const { container } = render(<EventsStripSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...eventsStripStyles.strip.split(' '))
  })

  it('draws the title, three event chips inside the real viewport and the expand toggle', () => {
    const { container } = render(<EventsStripSkeleton />)

    const [title, viewport, toggle] = Array.from(container.firstElementChild?.children ?? [])

    expect(title).toHaveClass('w-[47px]')
    expect(viewport).toHaveClass(...eventsStripStyles.viewport.split(' '))
    expect(viewport?.firstElementChild?.children).toHaveLength(PLACEHOLDER_CHIPS)
    expect(toggle).toHaveClass('max-[619px]:portrait:hidden')
  })
})
