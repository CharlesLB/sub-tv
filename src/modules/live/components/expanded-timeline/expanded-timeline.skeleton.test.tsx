import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { timelineRowStyles } from '../timeline-row/timeline-row.styles'
import { ExpandedTimelineSkeleton } from './expanded-timeline.skeleton'
import { expandedTimelineStyles } from './expanded-timeline.styles'

const PLACEHOLDER_ROWS = 3

describe('ExpandedTimelineSkeleton', () => {
  it('lays out the placeholder panel and header like the real expanded timeline', () => {
    const { container } = render(<ExpandedTimelineSkeleton showRotateNotice={false} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass(...expandedTimelineStyles.panel.split(' '))
    expect(container.firstElementChild?.firstElementChild).toHaveClass(...expandedTimelineStyles.header.split(' '))
  })

  it('draws three timeline rows alternating between the home and away cells', () => {
    const { container } = render(<ExpandedTimelineSkeleton showRotateNotice={false} />)

    const rows = Array.from(container.firstElementChild?.children ?? []).slice(1)
    const filledCells = rows.map((row) => [row.children[0]?.children.length, row.children[2]?.children.length])

    expect(rows).toHaveLength(PLACEHOLDER_ROWS)
    expect(rows[0]).toHaveClass(...timelineRowStyles.row.split(' '))

    expect(filledCells).toEqual([
      [2, 0],
      [0, 2],
      [2, 0],
    ])
  })

  it('shows the rotate notice above the placeholders on portrait phones', () => {
    render(<ExpandedTimelineSkeleton showRotateNotice />)

    expect(screen.getByText('Gire O celular para A prancheta')).toBeInTheDocument()
  })

  it('leaves the rotate notice out when asked', () => {
    render(<ExpandedTimelineSkeleton showRotateNotice={false} />)

    expect(screen.queryByText('Gire O celular para A prancheta')).not.toBeInTheDocument()
  })
})
