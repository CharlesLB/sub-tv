import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadWorkspaceSkeleton } from './squad-workspace.skeleton'

describe('SquadWorkspaceSkeleton', () => {
  it('hides the roster and sheet placeholders from assistive technology', () => {
    const { container } = render(<SquadWorkspaceSkeleton />)

    expect(container.children).toHaveLength(2)
    expect(container.children[0]).toHaveAttribute('aria-hidden', 'true')
    expect(container.children[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('stacks the header, column header and rows inside the roster placeholder', () => {
    const { container } = render(<SquadWorkspaceSkeleton />)

    const [header, columnHeader, rows] = Array.from(container.children[0]?.children ?? [])
    expect(header).toBeDefined()
    expect(columnHeader).toBeDefined()
    expect(rows?.children).toHaveLength(12)
  })
})
