import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamCampaignSkeleton } from './team-campaign.skeleton'

describe('TeamCampaignSkeleton', () => {
  it('hides the campaign from assistive technology and exposes no link or heading', () => {
    const { container } = render(<TeamCampaignSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('draws eight season rows, alternating the row backgrounds', () => {
    const { container } = render(<TeamCampaignSkeleton />)

    const rows = [...(container.firstElementChild?.lastElementChild?.children ?? [])]
    expect(rows).toHaveLength(8)
    expect(rows[0]).toHaveClass('bg-pan')
    expect(rows[1]).toHaveClass('bg-pan0')
  })

  it('keeps the record column hidden on phones like the real table', () => {
    const { container } = render(<TeamCampaignSkeleton />)

    expect(container.querySelectorAll('.mobile\\:hidden')).toHaveLength(8)
  })
})
