import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { getChampionshipHeader } from '@/modules/championships'
import { SheetChampionshipDetails } from './sheet-championship-details'
import { championshipHeaderFixture } from './sheet-championship-details.fixtures'

describe('SheetChampionshipDetails', () => {
  it('shows the category tag and the championship name of the season', async () => {
    vi.mocked(getChampionshipHeader).mockResolvedValue(championshipHeaderFixture)

    render(<Suspense>{await SheetChampionshipDetails({ seasonId: championshipHeaderFixture.id })}</Suspense>)

    expect(getChampionshipHeader).toHaveBeenCalledWith(championshipHeaderFixture.id)
    expect(screen.getByText('SUB-14')).toBeInTheDocument()
    expect(screen.getByText('Campeonato Mineiro Sub-14')).toBeInTheDocument()
  })

  it('renders nothing when the season has no header', async () => {
    vi.mocked(getChampionshipHeader).mockResolvedValue(null)

    const { container } = render(<Suspense>{await SheetChampionshipDetails({ seasonId: championshipHeaderFixture.id })}</Suspense>)

    expect(container).toBeEmptyDOMElement()
  })
})
