import { render, screen } from '@testing-library/react'
import { useLinkStatus } from 'next/link'
import { describe, expect, it, vi } from 'vitest'
import { NAVIGATION_PROGRESS_LABEL } from '../navigation-progress/navigation-progress'
import { LinkPendingIndicator } from './link-pending-indicator'

vi.mock(import('next/link'), async (importOriginal) => ({ ...(await importOriginal()), useLinkStatus: vi.fn() }))

describe('LinkPendingIndicator', () => {
  it('shows the navigation progress while its link is navigating', () => {
    vi.mocked(useLinkStatus).mockReturnValue({ pending: true })

    render(<LinkPendingIndicator />)

    expect(screen.getByRole('progressbar', { name: NAVIGATION_PROGRESS_LABEL })).toBeInTheDocument()
  })

  it('shows nothing once its link is idle', () => {
    vi.mocked(useLinkStatus).mockReturnValue({ pending: false })

    render(<LinkPendingIndicator />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
