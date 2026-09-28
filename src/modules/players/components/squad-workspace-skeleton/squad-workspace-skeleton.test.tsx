import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SquadWorkspaceSkeleton } from './squad-workspace-skeleton'

describe('SquadWorkspaceSkeleton', () => {
  it('hides the roster and sheet placeholders from assistive technology', () => {
    const { container } = render(<SquadWorkspaceSkeleton />)

    expect(container.children).toHaveLength(2)
    expect(container.children[0]).toHaveAttribute('aria-hidden', 'true')
    expect(container.children[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws one placeholder row per roster line with a cell per column', () => {
    const { container } = render(<SquadWorkspaceSkeleton />)

    const rows = container.children[0]?.children[2]?.children
    expect(rows).toHaveLength(6)
    expect(rows?.[0]?.children).toHaveLength(6)
  })
})
